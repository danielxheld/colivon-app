export type RecurrenceType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom' | 'once'
export type AssignmentMode = 'auto' | 'manual' | 'roulette'
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type AssignedBy = 'manual' | 'auto' | 'roulette'
export type ChorePreference = 'love' | 'like' | 'neutral' | 'dislike' | 'hate'

export interface Chore {
  id: number
  household_id: number
  created_by: number
  title: string
  description?: string
  category?: string
  recurrence_type: RecurrenceType
  recurrence_interval?: number
  difficulty_points: number
  estimated_duration?: number
  requires_photo: boolean
  is_active: boolean
  assignment_mode: AssignmentMode
  current_assignment?: ChoreAssignment
  created_at: string
  updated_at: string
}

export interface ChoreAssignment {
  id: number
  chore_id: number
  chore?: Chore
  user_id: number
  user?: {
    id: number
    name: string
    email: string
  }
  assigned_at: string
  due_date: string
  status: AssignmentStatus
  assigned_by: AssignedBy
  is_overdue: boolean
  completion?: ChoreCompletion
  created_at: string
  updated_at: string
}

export interface ChoreCompletion {
  id: number
  chore_assignment_id: number
  completed_by: number
  completedBy?: {
    id: number
    name: string
    email: string
  }
  completed_at: string
  photo_path?: string
  photo_url?: string
  notes?: string
  xp_earned: number
  created_at: string
  updated_at: string
}

export interface UserChorePreference {
  id: number
  user_id: number
  chore_id: number
  preference: ChorePreference
  weight: number
  created_at: string
  updated_at: string
}

export interface GamificationStat {
  id: number
  user_id: number
  user?: {
    id: number
    name: string
    email: string
  }
  household_id: number
  total_xp: number
  level: number
  current_streak: number
  longest_streak: number
  total_chores_completed: number
  current_month_xp: number
  current_month_chores: number
  title: string
  xp_for_next_level: number
  level_progress: number
  created_at: string
  updated_at: string
}
