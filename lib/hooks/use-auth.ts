'use client'

import useSWR from 'swr'

interface User {
  id: string
  email: string
  name: string
  pubgId?: string
  role: 'user' | 'admin'
  balance: number
}

interface AuthResponse {
  user: User | null
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthResponse>(
    '/api/auth/session',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Login failed')
    }

    await mutate()
    return data
  }

  const register = async (email: string, password: string, name: string, pubgId?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, pubgId }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    await mutate()
    return data
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await mutate({ user: null }, false)
  }

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
    isAdmin: data?.user?.role === 'admin',
    error,
    login,
    register,
    logout,
    mutate,
  }
}
