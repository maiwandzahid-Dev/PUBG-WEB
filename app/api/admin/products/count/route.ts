import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/models/Product'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const count = await Product.countDocuments({ isActive: true })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Products count error:', error)
    return NextResponse.json(
      { error: 'Failed to count products' },
      { status: 500 }
    )
  }
}
