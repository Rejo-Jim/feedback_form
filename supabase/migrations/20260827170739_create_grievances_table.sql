/*
# Create grievances table — anonymous grievance & feedback portal

1. Purpose
   A single-tenant, no-auth anonymous portal. Submissions are fully anonymous:
   no user accounts, no PII stored. Each submission gets a random tracking code
   the submitter can use to check status later. Submitters may optionally mark
   a grievance as "public" so it appears on the transparency feed (subject +
   message + status only, never identifying info).

2. New Tables
   - `grievances`
     - `id` uuid PK
     - `tracking_code` text, unique, not null — random 10-char code for anonymous lookup
     - `category` text, not null — one of a fixed set (workplace, harassment, safety, ethics, facilities, leadership, process, other)
     - `subject` text, not null — short title (<= 160 chars)
     - `message` text, not null — full body
     - `priority` text, not null default 'normal' — low | normal | high | urgent
     - `department` text, nullable — optional target department
     - `status` text, not null default 'submitted' — submitted | acknowledged | in_review | resolved | closed
     - `is_public` boolean, not null default false — whether it shows in the public feed
     - `response` text, nullable — official response shown to submitter and (if public) on the feed
     - `responded_at` timestamptz, nullable
     - `created_at` timestamptz, default now()
     - `updated_at` timestamptz, default now()

3. Indexes
   - unique index on `tracking_code` (fast lookups + uniqueness)
   - index on `created_at desc` (dashboard / feed ordering)
   - index on `status` (dashboard filtering)
   - index on `is_public` where true (public feed)

4. Security
   - RLS enabled.
   - No sign-in in this app → policies scoped TO anon, authenticated.
   - SELECT: allow reading rows that are public OR (for private rows) only when
     the requester supplies the matching tracking_code via the `track_*`
     SECURITY DEFINER function (see below). A blanket SELECT USING(true) would
     leak private grievances, so SELECT is locked to public rows only.
   - INSERT: anyone may insert (anonymous submission). WITH CHECK(true).
   - UPDATE / DELETE: denied to anon/authenticated — only the
     `update_grievance_status` SECURITY DEFINER function (callable by anon with
     the tracking code) can mutate status/response, and it verifies the code
     matches before updating. This keeps mutations server-enforced while still
     being usable by an unauthenticated submitter who knows the code.

5. Functions
   - `track_grievance(p_code text)` SECURITY DEFINER, returns the grievance row
     for a given tracking code. Lets a submitter look up their own private
     submission by code without exposing other private rows through a plain
     SELECT.
   - `update_grievance_status(p_code text, p_status text, p_response text)`
     SECURITY DEFINER — verifies the code, updates status/response/responded_at.
     Used by the portal's "official response" flow (operator-side) but callable
     by anyone holding the code; the code acts as a capability token.

6. Important notes
   - No user_id / auth.users linkage by design (anonymous).
   - tracking_code is generated server-side via a BEFORE INSERT trigger using
     gen_random_uuid() truncated/base32-style to avoid collisions and to keep
     the code from being guessable.
   - All timestamps are timestamptz.
*/

CREATE TABLE IF NOT EXISTS grievances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code text NOT NULL,
  category text NOT NULL,
  subject text NOT NULL CHECK (char_length(subject) <= 160),
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  department text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','acknowledged','in_review','resolved','closed')),
  is_public boolean NOT NULL DEFAULT false,
  response text,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS grievances_tracking_code_key ON grievances (tracking_code);
CREATE INDEX IF NOT EXISTS grievances_created_at_idx ON grievances (created_at DESC);
CREATE INDEX IF NOT EXISTS grievances_status_idx ON grievances (status);
CREATE INDEX IF NOT EXISTS grievances_public_idx ON grievances (created_at DESC) WHERE is_public = true;

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

-- Public rows are readable by everyone; private rows are NOT readable via plain SELECT.
DROP POLICY IF EXISTS "anon_select_public_grievances" ON grievances;
CREATE POLICY "anon_select_public_grievances" ON grievances FOR SELECT
  TO anon, authenticated USING (is_public = true);

-- Anyone may submit an anonymous grievance.
DROP POLICY IF EXISTS "anon_insert_grievances" ON grievances;
CREATE POLICY "anon_insert_grievances" ON grievances FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- No direct UPDATE or DELETE for anon/authenticated — mutations go through
-- the SECURITY DEFINER function which verifies the tracking code.
DROP POLICY IF EXISTS "anon_update_grievances" ON grievances;
CREATE POLICY "anon_update_grievances" ON grievances FOR UPDATE
  TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "anon_delete_grievances" ON grievances;
CREATE POLICY "anon_delete_grievances" ON grievances FOR DELETE
  TO anon, authenticated USING (false);

-- Keep updated_at in sync.
CREATE OR REPLACE FUNCTION trg_grievances_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grievances_set_updated_at ON grievances;
CREATE TRIGGER grievances_set_updated_at
  BEFORE UPDATE ON grievances
  FOR EACH ROW
  EXECUTE FUNCTION trg_grievances_set_updated_at();

-- Generate a random, hard-to-guess tracking code on insert if not provided.
-- Uses a 10-char base32-ish alphabet from a uuid + random suffix for entropy.
CREATE OR REPLACE FUNCTION gen_tracking_code()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT lpad(
    replace(
      replace(
        replace(
          upper(substr(md5(gen_random_uuid()::text || random()::text), 1, 10)),
          '0','Q'),
        'O','K'),
      'I','T'),
    10, 'X')
$$;

CREATE OR REPLACE FUNCTION trg_grievances_set_tracking_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
    NEW.tracking_code := gen_tracking_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grievances_set_tracking_code ON grievances;
CREATE TRIGGER grievances_set_tracking_code
  BEFORE INSERT ON grievances
  FOR EACH ROW
  WHEN (NEW.tracking_code IS NULL OR NEW.tracking_code = '')
  EXECUTE FUNCTION trg_grievances_set_tracking_code();

-- Lookup a private grievance by its tracking code (bypasses RLS safely).
CREATE OR REPLACE FUNCTION track_grievance(p_code text)
RETURNS grievances
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  g grievances%ROWTYPE;
BEGIN
  SELECT * INTO g FROM grievances WHERE tracking_code = p_code LIMIT 1;
  RETURN g;
END;
$$;

GRANT EXECUTE ON FUNCTION track_grievance(text) TO anon, authenticated;

-- Update a grievance's status/response given the correct tracking code.
CREATE OR REPLACE FUNCTION update_grievance_status(p_code text, p_status text, p_response text DEFAULT NULL)
RETURNS grievances
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  g grievances%ROWTYPE;
BEGIN
  SELECT * INTO g FROM grievances WHERE tracking_code = p_code LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'not_found';
  END IF;

  IF p_status IS NOT NULL THEN
    IF p_status NOT IN ('submitted','acknowledged','in_review','resolved','closed') THEN
      RAISE EXCEPTION 'invalid_status';
    END IF;
    g.status := p_status;
  END IF;

  IF p_response IS NOT NULL THEN
    g.response := p_response;
    g.responded_at := now();
  END IF;

  UPDATE grievances
    SET status = g.status,
        response = g.response,
        responded_at = g.responded_at
    WHERE id = g.id
    RETURNING * INTO g;

  RETURN g;
END;
$$;

GRANT EXECUTE ON FUNCTION update_grievance_status(text, text, text) TO anon, authenticated;
