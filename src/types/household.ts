import type { User } from './user'

export interface Household {
  id: number
  name: string
  description: string | null
  invite_code: string
  owner_id: number
  owner?: User
  members?: HouseholdMember[]
  created_at: string
  updated_at: string
}

export interface HouseholdMember extends User {
  pivot: {
    household_id: number
    user_id: number
    role: 'owner' | 'admin' | 'member'
    created_at: string
    updated_at: string
  }
}
