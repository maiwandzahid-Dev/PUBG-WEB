'use client'

import useSWR from 'swr'

export interface Product {
  _id: string
  name: string
  description: string
  ucAmount: number
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  isPopular: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

interface CartResponse {
  cart: {
    id: string
    items: CartItem[]
  } | null
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<CartResponse>(
    '/api/cart',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const items = data?.cart?.items ?? []

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const totalUC = items.reduce(
    (sum, item) => sum + item.product.ucAmount * item.quantity,
    0
  )

  const addItem = async (productId: string, quantity = 1) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to add item')
    }

    await mutate()
    return data
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to update item')
    }

    await mutate()
    return data
  }

  const removeItem = async (productId: string) => {
    const res = await fetch(`/api/cart?productId=${productId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Failed to remove item')
    }

    await mutate()
  }

  const clearCart = async () => {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Failed to clear cart')
    }

    await mutate()
  }

  return {
    items,
    totalItems,
    totalPrice,
    totalUC,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    mutate,
  }
}
