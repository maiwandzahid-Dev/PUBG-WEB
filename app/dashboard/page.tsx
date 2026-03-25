'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  ShoppingBag, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  Package,
  ArrowRight
} from 'lucide-react'

interface Order {
  _id: string
  totalAmount: number
  totalUC: number
  pubgId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500' },
  processing: { label: 'Processing', icon: Loader2, color: 'bg-blue-500/10 text-blue-500' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-500/10 text-green-500' },
  failed: { label: 'Failed', icon: XCircle, color: 'bg-red-500/10 text-red-500' },
  refunded: { label: 'Refunded', icon: XCircle, color: 'bg-gray-500/10 text-gray-500' },
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: ordersData, isLoading: ordersLoading } = useSWR<{ orders: Order[] }>(
    isAuthenticated ? '/api/orders' : null,
    fetcher
  )

  const orders = ordersData?.orders ?? []

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const completedOrders = orders.filter((o) => o.status === 'completed').length
  const totalSpent = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const totalUCPurchased = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalUC, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your orders and account settings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-foreground">{completedOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total UC</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalUCPurchased.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your recent UC purchases</CardDescription>
                  </div>
                  <Link href="/store">
                    <Button size="sm" className="gap-2">
                      New Order <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ShoppingBag className="mb-2 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Link href="/store" className="mt-4">
                        <Button size="sm">Browse Store</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {orders.slice(0, 5).map((order) => {
                        const config = statusConfig[order.status]
                        const StatusIcon = config.icon
                        return (
                          <div key={order._id} className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Zap className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {order.items.map((i) => i.productName).join(', ')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                ${order.totalAmount.toFixed(2)}
                              </p>
                              <Badge className={`${config.color} border-0`}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Card */}
            <div>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{user?.name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{user?.email}</p>
                    {user?.pubgId && (
                      <Badge variant="outline" className="mb-4">
                        PUBG ID: {user.pubgId}
                      </Badge>
                    )}
                    <div className="w-full space-y-2">
                      <Link href="/profile" className="block">
                        <Button variant="outline" className="w-full">
                          Edit Profile
                        </Button>
                      </Link>
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
