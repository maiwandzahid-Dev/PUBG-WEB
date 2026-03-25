import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/User'
import { getSession, sanitizeInput } from '@/lib/auth'

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
    const { name, pubgId } = body

    const updateData: { name?: string; pubgId?: string } = {}

    if (name) {
      updateData.name = sanitizeInput(name)
    }

    if (pubgId !== undefined) {
      updateData.pubgId = pubgId ? sanitizeInput(pubgId) : ''
    }

    await connectToDatabase()

    const user = await User.findByIdAndUpdate(
      session.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        pubgId: user.pubgId,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
