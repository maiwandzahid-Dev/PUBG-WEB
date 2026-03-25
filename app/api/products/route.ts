import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/models/Product'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const popular = searchParams.get('popular')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isActive: true }

    if (category && category !== 'all') {
      query.category = category
    }

    if (popular === 'true') {
      query.isPopular = true
    }

    const products = await Product.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    await connectToDatabase()

    const product = await Product.create(body)

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
