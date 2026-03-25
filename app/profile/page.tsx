'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Gamepad, Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, mutate } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    pubgId: '',
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        pubgId: user.pubgId || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully')
      mutate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update')
    } finally {
      setIsUpdating(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Profile Settings</h1>

          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {user.email}
                      {user.role === 'admin' && (
                        <Badge className="bg-primary/10 text-primary">
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Edit Form */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="pl-10 opacity-60"
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="name">Full Name</FieldLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10"
                          disabled={isUpdating}
                        />
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="pubgId">PUBG Mobile ID</FieldLabel>
                      <div className="relative">
                        <Gamepad className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="pubgId"
                          type="text"
                          value={formData.pubgId}
                          onChange={(e) => setFormData({ ...formData, pubgId: e.target.value })}
                          placeholder="Enter your PUBG ID"
                          className="pl-10"
                          disabled={isUpdating}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your PUBG ID is used for UC delivery
                      </p>
                    </Field>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
