'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { useCart } from '@/lib/hooks/use-cart'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  Loader2, 
  ShoppingBag, 
  CreditCard, 
  Wallet, 
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, totalPrice, totalUC, clearCart, isLoading: cartLoading } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [pubgId, setPubgId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user?.pubgId) {
      setPubgId(user.pubgId)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pubgId.trim()) {
      toast.error('Please enter your PUBG ID')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pubgId: pubgId.trim(),
          paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      setOrderComplete(true)
      await clearCart()
      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || cartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center bg-background py-12">
          <Card className="mx-4 w-full max-w-md border-border bg-card text-center">
            <CardContent className="p-8">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Order Placed!</h2>
              <p className="mb-6 text-muted-foreground">
                Your UC will be delivered to your PUBG account shortly. Check your in-game mail!
              </p>
              <div className="space-y-2">
                <Link href="/dashboard">
                  <Button className="w-full">View Orders</Button>
                </Link>
                <Link href="/store">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center bg-background py-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">Add items to your cart to checkout</p>
            <Link href="/store">
              <Button>Browse Store</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* PUBG ID */}
                <Card className="mb-6 border-border bg-card">
                  <CardHeader>
                    <CardTitle>PUBG Account</CardTitle>
                    <CardDescription>Enter your PUBG Mobile ID for UC delivery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="pubgId">PUBG Mobile ID</FieldLabel>
                        <Input
                          id="pubgId"
                          type="text"
                          placeholder="Enter your PUBG ID (e.g., 5123456789)"
                          value={pubgId}
                          onChange={(e) => setPubgId(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Find your ID in PUBG Mobile under Profile Settings
                        </p>
                      </Field>
                    </FieldGroup>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="mb-6 border-border bg-card">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select how you want to pay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-3">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Credit / Debit Card</p>
                              <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                          <RadioGroupItem value="wallet" id="wallet" />
                          <Label htmlFor="wallet" className="flex flex-1 cursor-pointer items-center gap-3">
                            <Wallet className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Digital Wallet</p>
                              <p className="text-sm text-muted-foreground">PayPal, Apple Pay, Google Pay</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <Shield className="h-5 w-5 text-green-500" />
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>

                <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Order - ${totalPrice.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 border-border bg-card">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.product._id} className="flex items-center gap-3 py-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary/10">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                    </div>
                    {totalUC > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total UC</span>
                        <span className="font-semibold text-primary">
                          {totalUC.toLocaleString()} UC
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
