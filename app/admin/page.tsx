'use client'

import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
  Zap
} from 'lucide-react'

interface Order {
  _id: string
  totalAmount: number
  totalUC: number
  status: string
  createdAt: string
  user: { name: string; email: string }
  items: Array<{ productName: string; quantity: number }>
}

interface Stats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalUCSold: number
  pendingOrders: number
  completedOrders: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const { data: ordersData, isLoading: ordersLoading } = useSWR<{ orders: Order[] }>(
    '/api/orders',
    fetcher
  )
  const { data: usersData, isLoading: usersLoading } = useSWR<{ users: number }>(
    '/api/admin/users/count',
    fetcher
  )
  const { data: productsData, isLoading: productsLoading } = useSWR<{ count: number }>(
    '/api/admin/products/count',
    fetcher
  )

  const orders = ordersData?.orders ?? []
  const isLoading = ordersLoading || usersLoading || productsLoading

  const stats: Stats = {
    totalUsers: usersData?.users ?? 0,
    totalOrders: orders.length,
    totalRevenue: orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0),
    totalUCSold: orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalUC, 0),
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    completedOrders: orders.filter((o) => o.status === 'completed').length,
  }

  const recentOrders = orders.slice(0, 5)

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    processing: 'bg-blue-500/10 text-blue-500',
    completed: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
    refunded: 'bg-gray-500/10 text-gray-500',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-yellow-500">{stats.pendingOrders} pending</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-green-500">{stats.completedOrders} completed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-blue-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  +5 new this week
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">UC Sold</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalUCSold.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {productsData?.count ?? 0} products active
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Package className="mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Order</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Items</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="border-b border-border last:border-0">
                          <td className="py-4">
                            <span className="font-mono text-sm text-foreground">
                              #{order._id.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {order.user?.name || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.user?.email || 'N/A'}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="text-sm text-foreground">
                              {order.items.map((i) => i.productName).join(', ')}
                            </p>
                          </td>
                          <td className="py-4">
                            <p className="font-medium text-foreground">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </td>
                          <td className="py-4">
                            <Badge className={`${statusColors[order.status]} border-0`}>
                              {order.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                              {order.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
