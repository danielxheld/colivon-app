/**
 * Safe localStorage access with error handling
 */
export function useLocalStorage() {
  const isAvailable = (): boolean => {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  const getItem = <T = string>(key: string): T | null => {
    if (!isAvailable()) return null

    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      // Try to parse as JSON, otherwise return as string
      try {
        return JSON.parse(item) as T
      } catch {
        return item as T
      }
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return null
    }
  }

  const setItem = <T = any>(key: string, value: T): boolean => {
    if (!isAvailable()) return false

    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded')
      } else {
        console.error(`Error writing to localStorage key "${key}":`, error)
      }
      return false
    }
  }

  const removeItem = (key: string): boolean => {
    if (!isAvailable()) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  }

  const clear = (): boolean => {
    if (!isAvailable()) return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    isAvailable,
  }
}
