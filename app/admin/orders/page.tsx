'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Eye,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  _id: string
  totalAmount: number
  totalUC: number
  pubgId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
  user: { _id: string; name: string; email: string }
  items: Array<{ productName: string; quantity: number; price: number; ucAmount: number }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500' },
  processing: { label: 'Processing', icon: Loader2, color: 'bg-blue-500/10 text-blue-500' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-500/10 text-green-500' },
  failed: { label: 'Failed', icon: XCircle, color: 'bg-red-500/10 text-red-500' },
  refunded: { label: 'Refunded', icon: XCircle, color: 'bg-gray-500/10 text-gray-500' },
}

export default function AdminOrdersPage() {
  const { data, isLoading, mutate } = useSWR<{ orders: Order[] }>('/api/orders', fetcher)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const orders = data?.orders ?? []

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pubgId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update order')
      }

      toast.success('Order status updated')
      mutate()
      setSelectedOrder(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => mutate()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">PUBG ID</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const config = statusConfig[order.status]
                    const StatusIcon = config.icon
                    return (
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
                          <span className="text-sm text-foreground">{order.pubgId}</span>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-xs text-primary">
                              {order.totalUC.toLocaleString()} UC
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={`${config.color} border-0`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Order #{selectedOrder?._id.slice(-6).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">Customer</h4>
                <p className="text-sm text-foreground">{selectedOrder.user?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                <p className="text-sm text-primary">PUBG ID: {selectedOrder.pubgId}</p>
              </div>

              {/* Items */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="text-muted-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">Update Status</h4>
                <div className="flex gap-2">
                  <Select
                    defaultValue={selectedOrder.status}
                    onValueChange={(value) => handleUpdateStatus(selectedOrder._id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
