<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-block p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl mb-6">
          <div class="text-5xl">🏠</div>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p class="text-gray-600">
          Sign in to manage your household
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <!-- Error Message -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="authStore.error" class="mb-6 rounded-2xl bg-red-50 border-2 border-red-200 p-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-red-800">{{ authStore.error }}</p>
            </div>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="block w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="your@email.com"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="••••••••"
              >
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-8"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In →</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/register" class="font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:from-indigo-700 hover:to-purple-700 transition-all">
              Register now
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          Smart household management for modern living
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

async function handleLogin() {
  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch (error: any) {
    console.error('Login error:', error)
  }
}
</script>
