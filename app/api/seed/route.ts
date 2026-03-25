import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/models/Product'
import User from '@/lib/models/User'

const defaultProducts = [
  {
    name: '60 UC',
    description: 'Get 60 Unknown Cash for PUBG Mobile',
    ucAmount: 60,
    price: 0.99,
    originalPrice: 1.29,
    discount: 23,
    category: 'uc',
    isPopular: false,
    isActive: true,
  },
  {
    name: '325 UC',
    description: 'Get 325 Unknown Cash for PUBG Mobile',
    ucAmount: 325,
    price: 4.99,
    originalPrice: 5.99,
    discount: 17,
    category: 'uc',
    isPopular: true,
    isActive: true,
  },
  {
    name: '660 UC',
    description: 'Get 660 Unknown Cash for PUBG Mobile',
    ucAmount: 660,
    price: 9.99,
    originalPrice: 11.99,
    discount: 17,
    category: 'uc',
    isPopular: true,
    isActive: true,
  },
  {
    name: '1800 UC',
    description: 'Get 1800 Unknown Cash for PUBG Mobile',
    ucAmount: 1800,
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    category: 'uc',
    isPopular: true,
    isActive: true,
  },
  {
    name: '3850 UC',
    description: 'Get 3850 Unknown Cash for PUBG Mobile',
    ucAmount: 3850,
    price: 49.99,
    originalPrice: 59.99,
    discount: 17,
    category: 'uc',
    isPopular: false,
    isActive: true,
  },
  {
    name: '8100 UC',
    description: 'Get 8100 Unknown Cash for PUBG Mobile - Best Value!',
    ucAmount: 8100,
    price: 99.99,
    originalPrice: 119.99,
    discount: 17,
    category: 'uc',
    isPopular: true,
    isActive: true,
  },
  {
    name: 'Royale Pass Plus',
    description: 'Unlock the Elite Royale Pass with exclusive rewards',
    ucAmount: 0,
    price: 9.99,
    category: 'royale-pass',
    isPopular: true,
    isActive: true,
  },
  {
    name: 'Royale Pass Elite',
    description: 'Unlock the Elite+ Royale Pass with 25 rank boost',
    ucAmount: 0,
    price: 24.99,
    category: 'royale-pass',
    isPopular: false,
    isActive: true,
  },
  {
    name: 'Premium Crate',
    description: 'Open a Premium Crate with exclusive skins',
    ucAmount: 0,
    price: 4.99,
    category: 'crate',
    isPopular: false,
    isActive: true,
  },
  {
    name: 'Classic Crate Bundle',
    description: '10x Classic Crate opening with guaranteed legendary',
    ucAmount: 0,
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    category: 'bundle',
    isPopular: true,
    isActive: true,
  },
]

export async function POST() {
  try {
    await connectToDatabase()

    // Check if products already exist
    const existingProducts = await Product.countDocuments()
    
    if (existingProducts === 0) {
      await Product.insertMany(defaultProducts)
    }

    // Create admin user if doesn't exist
    const adminEmail = 'admin@pubgstore.com'
    const existingAdmin = await User.findOne({ email: adminEmail })
    
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        password: 'Admin123!',
        name: 'Admin',
        role: 'admin',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      productsCreated: existingProducts === 0 ? defaultProducts.length : 0,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
