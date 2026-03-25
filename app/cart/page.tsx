'use client'

import Link from 'next/link'
import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { useCart } from '@/lib/hooks/use-cart'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Loader2,
  Zap 
} from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, totalItems, totalPrice, totalUC, isLoading, updateQuantity, removeItem } = useCart()
  const { isAuthenticated } = useAuth()

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update quantity')
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove item')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Shopping Cart</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold text-foreground">Please login</h2>
              <p className="mb-6 text-muted-foreground">You need to be logged in to view your cart</p>
              <Link href="/login">
                <Button>Login to Continue</Button>
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h2>
              <p className="mb-6 text-muted-foreground">Add some UC packages to get started</p>
              <Link href="/store">
                <Button>Browse Store</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Cart Items ({totalItems})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.product._id} className="flex items-center gap-4 py-4">
                          {/* Product Icon */}
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Zap className="h-8 w-8 text-primary" />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {item.product.name}
                            </h3>
                            {item.product.ucAmount > 0 && (
                              <p className="text-sm text-primary">
                                {item.product.ucAmount.toLocaleString()} UC
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              ${item.product.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRemoveItem(item.product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24 border-border bg-card">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Items ({totalItems})</span>
                        <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                      </div>
                      {totalUC > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total UC</span>
                          <span className="text-primary font-semibold">
                            {totalUC.toLocaleString()} UC
                          </span>
                        </div>
                      )}
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="text-xl font-bold text-primary">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Link href="/checkout" className="block">
                        <Button className="w-full gap-2">
                          Proceed to Checkout
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/store" className="block">
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
