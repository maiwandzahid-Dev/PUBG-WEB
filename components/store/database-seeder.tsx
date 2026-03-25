'use client'

import { useEffect, useRef } from 'react'

export function DatabaseSeeder() {
  const hasSeeded = useRef(false)

  useEffect(() => {
    if (hasSeeded.current) return
    hasSeeded.current = true

    // Seed database on first load
    fetch('/api/seed', { method: 'POST' })
      .then((res) => res.json())
      .catch(() => {
        // Silently fail - this is just for initial seeding
      })
  }, [])

  return null
}
