import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type {
  Chore,
  ChoreAssignment,
  ChoreCompletion,
  GamificationStat,
  UserChorePreference,
} from '@/types/chore'

export const useChoreStore = defineStore('chore', () => {
  const chores = ref<Chore[]>([])
  const myAssignments = ref<ChoreAssignment[]>([])
  const myStats = ref<GamificationStat | null>(null)
  const monthlyLeaderboard = ref<GamificationStat[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchChores(householdId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/chores', {
        params: { household_id: householdId },
      })
      chores.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch chores'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createChore(data: {
    household_id: number
    title: string
    description?: string
    recurrence_type: string
    recurrence_interval?: number
    difficulty_points?: number
    estimated_duration?: number
    requires_photo?: boolean
    assignment_mode?: string
  }) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/chores', data)
      chores.value.unshift(response.data.chore)
      return response.data.chore
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create chore'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateChore(choreId: number, data: Partial<Chore>) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/chores/${choreId}`, data)
      const index = chores.value.findIndex((c) => c.id === choreId)
      if (index !== -1) {
        chores.value[index] = response.data.chore
      }
      return response.data.chore
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update chore'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteChore(choreId: number) {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/chores/${choreId}`)
      chores.value = chores.value.filter((c) => c.id !== choreId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete chore'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyAssignments() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/chore-assignments/my')
      myAssignments.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch assignments'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function assignChore(choreId: number, userId: number, dueDate: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/chores/${choreId}/assign`, {
        user_id: userId,
        due_date: dueDate,
      })
      return response.data.assignment
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to assign chore'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeAssignment(
    assignmentId: number,
    photo?: File,
    notes?: string
  ): Promise<ChoreCompletion> {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      if (photo) {
        formData.append('photo', photo)
      }
      if (notes) {
        formData.append('notes', notes)
      }

      const response = await api.post(`/chore-assignments/${assignmentId}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Update local assignments
      const index = myAssignments.value.findIndex((a) => a.id === assignmentId)
      if (index !== -1) {
        myAssignments.value[index] = response.data.assignment
      }

      return response.data.completion
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to complete chore'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePreference(choreId: number, preference: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/chore-preferences', {
        chore_id: choreId,
        preference,
      })
      return response.data.preference
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update preference'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function runRoulette(householdId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/chore-assignments/roulette', {
        household_id: householdId,
      })
      return response.data.assignments
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to run roulette'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyStats(householdId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/gamification/my-stats', {
        params: { household_id: householdId },
      })
      myStats.value = response.data.stats
      return {
        stats: response.data.stats,
        rank: response.data.rank,
        total_members: response.data.total_members,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch stats'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMonthlyLeaderboard(householdId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/gamification/leaderboard/monthly', {
        params: { household_id: householdId },
      })
      monthlyLeaderboard.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch leaderboard'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    chores,
    myAssignments,
    myStats,
    monthlyLeaderboard,
    loading,
    error,
    fetchChores,
    createChore,
    updateChore,
    deleteChore,
    fetchMyAssignments,
    assignChore,
    completeAssignment,
    updatePreference,
    runRoulette,
    fetchMyStats,
    fetchMonthlyLeaderboard,
  }
})
