import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Household } from '@/types/household'

export const useHouseholdStore = defineStore('household', () => {
  const households = ref<Household[]>([])
  const currentHousehold = ref<Household | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchHouseholds() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/households')
      households.value = response.data.data // API Resources return data in 'data' key

      // Set first household as current if none selected
      if (!currentHousehold.value && households.value.length > 0) {
        currentHousehold.value = households.value[0] ?? null
      }

      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch households'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createHousehold(name: string, description?: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/households', {
        name,
        description,
      })

      households.value.push(response.data.household)
      currentHousehold.value = response.data.household

      return response.data.household
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create household'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function joinHousehold(inviteCode: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/households/join', {
        invite_code: inviteCode,
      })

      households.value.push(response.data.household)
      currentHousehold.value = response.data.household

      return response.data.household
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to join household'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function leaveHousehold(householdId: number) {
    loading.value = true
    error.value = null

    try {
      await api.post(`/households/${householdId}/leave`)

      households.value = households.value.filter((h) => h.id !== householdId)

      if (currentHousehold.value?.id === householdId) {
        currentHousehold.value = households.value.length > 0 ? (households.value[0] ?? null) : null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to leave household'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateHousehold(householdId: number, name: string, description?: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/households/${householdId}`, {
        name,
        description,
      })

      const index = households.value.findIndex((h) => h.id === householdId)
      if (index !== -1) {
        households.value[index] = response.data.household
      }

      if (currentHousehold.value?.id === householdId) {
        currentHousehold.value = response.data.household
      }

      return response.data.household
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update household'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteHousehold(householdId: number) {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/households/${householdId}`)

      households.value = households.value.filter((h) => h.id !== householdId)

      if (currentHousehold.value?.id === householdId) {
        currentHousehold.value = households.value.length > 0 ? (households.value[0] ?? null) : null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete household'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setCurrentHousehold(household: Household) {
    currentHousehold.value = household
  }

  return {
    households,
    currentHousehold,
    loading,
    error,
    fetchHouseholds,
    createHousehold,
    joinHousehold,
    leaveHousehold,
    updateHousehold,
    deleteHousehold,
    setCurrentHousehold,
  }
})
