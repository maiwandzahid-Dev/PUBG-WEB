import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/User'
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

    const users = await User.countDocuments()

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Users count error:', error)
    return NextResponse.json(
      { error: 'Failed to count users' },
      { status: 500 }
    )
  }
}
