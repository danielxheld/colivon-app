import type { User } from './user'

export interface ShoppingList {
  id: number
  household_id: number
  user_id: number
  name: string
  is_public: boolean
  store?: string | null
  currently_shopping_by_id?: number | null
  is_template: boolean
  template_name?: string | null
  estimated_total?: number | null
  actual_total?: number | null
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
  price?: number | null
  aisle_order?: number | null
  image_url?: string | null
  is_completed: boolean
  is_recurring: boolean
  recurrence_interval: 'daily' | 'weekly' | 'monthly' | null
  next_recurrence_date?: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
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
