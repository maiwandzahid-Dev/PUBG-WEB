import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Order from '@/lib/models/Order'
import Cart from '@/lib/models/Cart'
import Product from '@/lib/models/Product'
import { getSession, sanitizeInput } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const query = session.role === 'admin' 
      ? {} 
      : { user: session.userId }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Please login to place an order' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { pubgId, paymentMethod } = body

    if (!pubgId) {
      return NextResponse.json(
        { error: 'PUBG ID is required' },
        { status: 400 }
      )
    }

    const sanitizedPubgId = sanitizeInput(pubgId)

    await connectToDatabase()

    // Get user's cart
    const cart = await Cart.findOne({ user: session.userId }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty' },
        { status: 400 }
      )
    }

    // Calculate totals and prepare order items
    let totalAmount = 0
    let totalUC = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = item.product as unknown as {
        _id: string
        name: string
        ucAmount: number
        price: number
        isActive: boolean
        stock: number
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `Product ${product.name} is no longer available` },
          { status: 400 }
        )
      }

      if (product.stock !== -1 && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      totalAmount += product.price * item.quantity
      totalUC += product.ucAmount * item.quantity

      orderItems.push({
        product: product._id,
        productName: product.name,
        ucAmount: product.ucAmount,
        price: product.price,
        quantity: item.quantity,
      })

      // Update stock if not unlimited
      if (product.stock !== -1) {
        await Product.findByIdAndUpdate(product._id, {
          $inc: { stock: -item.quantity },
        })
      }
    }

    // Create order
    const order = await Order.create({
      user: session.userId,
      items: orderItems,
      totalAmount,
      totalUC,
      pubgId: sanitizedPubgId,
      paymentMethod: paymentMethod || 'balance',
      status: 'pending',
    })

    // Clear cart
    await Cart.deleteOne({ user: session.userId })

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        totalUC: order.totalUC,
        status: order.status,
      },
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
