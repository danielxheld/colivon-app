import type { User } from './user'

export interface ShoppingList {
  id: number
  household_id: number
  user_id: number
  name: string
  is_public: boolean
  user?: User
  items?: ShoppingListItem[]
  created_at: string
  updated_at: string
}

export interface ShoppingListItem {
  id: number
  shopping_list_id: number
  name: string
  quantity: string | null
  unit: string | null
  is_completed: boolean
  is_recurring: boolean
  recurrence_interval: 'daily' | 'weekly' | 'monthly' | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type RecurrenceInterval = 'daily' | 'weekly' | 'monthly'
