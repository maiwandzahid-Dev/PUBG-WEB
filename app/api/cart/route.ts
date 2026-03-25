import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Cart from '@/lib/models/Cart'
import Product from '@/lib/models/Product'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ cart: null, items: [] })
    }

    await connectToDatabase()

    const cart = await Cart.findOne({ user: session.userId }).populate('items.product')

    if (!cart) {
      return NextResponse.json({ cart: null, items: [] })
    }

    return NextResponse.json({
      cart: {
        id: cart._id,
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      },
    })
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Please login to add items to cart' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Verify product exists and is active
    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found or unavailable' },
        { status: 404 }
      )
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: session.userId })

    if (!cart) {
      cart = await Cart.create({
        user: session.userId,
        items: [{ product: productId, quantity }],
      })
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({ product: productId, quantity })
      }

      await cart.save()
    }

    // Populate and return cart
    await cart.populate('items.product')

    return NextResponse.json({
      success: true,
      cart: {
        id: cart._id,
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      },
    })
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    await connectToDatabase()

    const cart = await Cart.findOne({ user: session.userId })

    if (!cart) {
      return NextResponse.json({ success: true })
    }

    if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      )
      await cart.save()
    } else {
      // Clear entire cart
      await Cart.deleteOne({ user: session.userId })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const cart = await Cart.findOne({ user: session.userId })

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not in cart' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()
    await cart.populate('items.product')

    return NextResponse.json({
      success: true,
      cart: {
        id: cart._id,
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      },
    })
  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
