import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { signToken, sanitizeInput, validateEmail, validatePassword } from '@/lib/auth'      
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Required fields check
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase()
    const sanitizedName = sanitizeInput(name)

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    await connectToDatabase()

    const existingUser = await User.findOne({ email: sanitizedEmail })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in DB
    const user = await User.create({
      email: sanitizedEmail,
      password: hashedPassword,
      name: sanitizedName,
      role: 'user', // default role, important for JWT
    })

    // Generate JWT token with role included
    const token = await signToken({ 
      userId: user._id.toString(), 
      email: user.email, 
      role: user.role 
    })

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    // Return user info (without original password)
    return NextResponse.json({
      success: true,
      user: { id: user._id, email: user.email, name: user.name, hashedPassword: user.password, role: user.role }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}