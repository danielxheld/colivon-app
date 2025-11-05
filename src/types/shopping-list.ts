import type { User } from './user'

export interface ShoppingList {
  id: number
  household_id: number
  user_id: number
  name: string
  is_public: boolean
  store?: string | null
  currently_shopping_by_id?: number | null
  shopping_started_at?: string | null
  is_template: boolean
  template_name?: string | null
  estimated_total?: number | null
  actual_total?: number | null
  shopping_stats?: ShoppingStats | null
  last_sync?: string | null
  user?: User
  currently_shopping_by?: User
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
  category?: string | null
  note?: string | null
  notes_for_shopper?: string | null
  price?: number | null
  actual_price?: number | null
  shared_cost: boolean
  aisle_order?: number | null
  image_url?: string | null
  is_completed: boolean
  is_recurring: boolean
  recurrence_interval: 'daily' | 'weekly' | 'monthly' | null
  next_recurrence_date?: string | null
  claimed_by_id?: number | null
  bought_by_id?: number | null
  completed_at: string | null
  claimed_by?: User
  bought_by?: User
  created_at: string
  updated_at: string
}

export interface ShoppingStats {
  total_items: number
  total_spent: number
  estimated_total: number
  shoppers: Record<string, { items_count: number; total_spent: number }>
  completed_at: string
}

export interface ExpenseBreakdown {
  total_spent: number
  total_items: number
  shared_cost_total: number
  personal_cost_total: number
  by_person: PersonExpense[]
  split_calculation: SplitCalculation[]
}

export interface PersonExpense {
  user: { id: number; name: string }
  total_spent: number
  shared_items_total: number
  personal_items_total: number
  items_count: number
}

export interface SplitCalculation {
  user: { id: number; name: string }
  paid: number
  should_pay: number
  balance: number
}

export interface FavoriteItem {
  id: number
  household_id: number
  name: string
  category?: string | null
  quantity?: string | null
  unit?: string | null
  usage_count: number
  created_at: string
  updated_at: string
}

export type RecurrenceInterval = 'daily' | 'weekly' | 'monthly'

export type ItemCategory =
  | '🥬 Obst & Gemüse'
  | '🥛 Milchprodukte'
  | '🍞 Backwaren'
  | '🥫 Konserven'
  | '🧴 Haushalt'
  | '🍖 Fleisch & Fisch'
  | '❄️ Tiefkühl'
  | '🍝 Nudeln & Reis'
  | '🍫 Süßigkeiten'
  | '🥤 Getränke'
  | '🧂 Gewürze'
  | '🎂 Backzutaten'

export const ITEM_CATEGORIES: ItemCategory[] = [
  '🥬 Obst & Gemüse',
  '🥛 Milchprodukte',
  '🍞 Backwaren',
  '🥫 Konserven',
  '🧴 Haushalt',
  '🍖 Fleisch & Fisch',
  '❄️ Tiefkühl',
  '🍝 Nudeln & Reis',
  '🍫 Süßigkeiten',
  '🥤 Getränke',
  '🧂 Gewürze',
  '🎂 Backzutaten',
]

export type Store = 'Edeka' | 'Rewe' | 'Aldi' | 'Lidl' | 'Kaufland' | 'Bio-Laden' | 'DM' | 'Rossmann'

export const STORES: Store[] = [
  'Edeka',
  'Rewe',
  'Aldi',
  'Lidl',
  'Kaufland',
  'Bio-Laden',
  'DM',
  'Rossmann',
]
