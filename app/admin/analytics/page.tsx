'use client'

import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Loader2,
  Zap
} from 'lucide-react'

interface Order {
  _id: string
  totalAmount: number
  totalUC: number
  status: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminAnalyticsPage() {
  const { data: ordersData, isLoading: ordersLoading } = useSWR<{ orders: Order[] }>(
    '/api/orders',
    fetcher
  )
  const { data: usersData, isLoading: usersLoading } = useSWR<{ users: number }>(
    '/api/admin/users/count',
    fetcher
  )

  const isLoading = ordersLoading || usersLoading
  const orders = ordersData?.orders ?? []

  // Calculate analytics
  const completedOrders = orders.filter((o) => o.status === 'completed')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalUCSold = completedOrders.reduce((sum, o) => sum + o.totalUC, 0)
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

  // Group orders by status
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group revenue by day (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const revenueByDay = last7Days.map((day) => {
    const dayOrders = completedOrders.filter(
      (o) => o.createdAt.split('T')[0] === day
    )
    return {
      day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: dayOrders.length,
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Insights into your store performance</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${avgOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total UC Sold</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalUCSold.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold text-foreground">
                      {usersData?.users ?? 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Revenue (Last 7 Days)</CardTitle>
                <CardDescription>Daily revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByDay.map((day, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-muted-foreground">{day.day}</div>
                      <div className="flex-1">
                        <div className="relative h-8 w-full overflow-hidden rounded-lg bg-muted">
                          <div
                            className="absolute left-0 top-0 h-full bg-primary transition-all"
                            style={{
                              width: `${Math.max(
                                (day.revenue / Math.max(...revenueByDay.map((d) => d.revenue), 1)) * 100,
                                day.revenue > 0 ? 5 : 0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm font-medium text-foreground">
                        ${day.revenue.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Orders by Status */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'completed', label: 'Completed', color: 'bg-green-500' },
                    { status: 'pending', label: 'Pending', color: 'bg-yellow-500' },
                    { status: 'processing', label: 'Processing', color: 'bg-blue-500' },
                    { status: 'failed', label: 'Failed', color: 'bg-red-500' },
                    { status: 'refunded', label: 'Refunded', color: 'bg-gray-500' },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <div className="flex-1 text-sm text-foreground">{item.label}</div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {ordersByStatus[item.status] || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Total Orders</span>
                    <span className="text-xl font-bold text-primary">{orders.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
