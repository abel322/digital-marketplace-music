'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import axios from 'axios'

// ============================================================================
// INTERFACES
// ============================================================================

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER'
}

export interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

// ============================================================================
// USE AUTH HOOK
// ============================================================================

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const loading = status === 'loading'
  const isAuthenticated = status === 'authenticated' && !!session?.user
  const user = session?.user as User | null

  // ============================================================================
  // LOGIN
  // ============================================================================

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null)

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (!result?.ok) {
        throw new Error('Login failed. Please check your credentials.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    }
  }

  // ============================================================================
  // LOGOUT
  // ============================================================================

  const logout = async (): Promise<void> => {
    try {
      setError(null)
      await signOut({ redirect: false })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      throw err
    }
  }

  // ============================================================================
  // REGISTER
  // ============================================================================

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setError(null)

      const response = await axios.post('/api/auth/register', data)

      if (response.status !== 201) {
        throw new Error('Registration failed')
      }

      // Auto-login after successful registration
      await login(data.email, data.password)
    } catch (err) {
      let errorMessage = 'Registration failed'
      
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // ============================================================================
  // UPDATE PROFILE
  // ============================================================================

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      setError(null)

      if (!isAuthenticated) {
        throw new Error('You must be logged in to update your profile')
      }

      const response = await axios.patch('/api/user/profile', data)

      if (response.status !== 200) {
        throw new Error('Profile update failed')
      }

      // Session will be updated automatically by NextAuth
    } catch (err) {
      let errorMessage = 'Profile update failed'
      
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  }
}
