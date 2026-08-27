import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
})

export type GrievanceStatus = 'submitted' | 'acknowledged' | 'in_review' | 'resolved' | 'closed'

export interface Grievance {
  id: string
  tracking_code: string
  category: string
  subject: string
  message: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  department: string | null
  status: GrievanceStatus
  is_public: boolean
  created_at: string
  updated_at: string
  response: string | null
  responded_at: string | null
}

export const CATEGORIES = [
  { value: 'workplace', label: 'Workplace Conduct', icon: 'briefcase' },
  { value: 'harassment', label: 'Harassment / Discrimination', icon: 'shield' },
  { value: 'safety', label: 'Health & Safety', icon: 'alert' },
  { value: 'ethics', label: 'Ethics & Compliance', icon: 'scale' },
  { value: 'facilities', label: 'Facilities & Operations', icon: 'building' },
  { value: 'leadership', label: 'Leadership & Management', icon: 'users' },
  { value: 'process', label: 'Process & Policy', icon: 'clipboard' },
  { value: 'other', label: 'Other Feedback', icon: 'message' },
] as const

export const PRIORITIES = [
  { value: 'low', label: 'Low', tone: 'ink' },
  { value: 'normal', label: 'Normal', tone: 'brand' },
  { value: 'high', label: 'High', tone: 'warning' },
  { value: 'urgent', label: 'Urgent', tone: 'error' },
] as const

export const STATUS_META: Record<GrievanceStatus, { label: string; tone: string; step: number }> = {
  submitted: { label: 'Submitted', tone: 'ink', step: 1 },
  acknowledged: { label: 'Acknowledged', tone: 'brand', step: 2 },
  in_review: { label: 'In Review', tone: 'warning', step: 3 },
  resolved: { label: 'Resolved', tone: 'success', step: 4 },
  closed: { label: 'Closed', tone: 'ink', step: 5 },
}
