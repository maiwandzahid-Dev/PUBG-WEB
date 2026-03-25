'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Loader2,
  Zap,
  Star,
  Package,
  Edit,
  Search
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/lib/hooks/use-cart'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const categoryIcons = {
  uc: Zap,
  'royale-pass': Star,
  crate: Package,
  bundle: Package,
}

export default function AdminProductsPage() {
  const { data, isLoading, mutate } = useSWR<{ products: Product[] }>(
    '/api/products',
    fetcher
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ucAmount: 0,
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: 'uc',
    isPopular: false,
    isActive: true,
  })

  const products = data?.products ?? []

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      ucAmount: 0,
      price: 0,
      originalPrice: 0,
      discount: 0,
      category: 'uc',
      isPopular: false,
      isActive: true,
    })
    setEditingProduct(null)
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        ucAmount: product.ucAmount,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        discount: product.discount || 0,
        category: product.category,
        isPopular: product.isPopular,
        isActive: true,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct._id}`
        : '/api/products'
      
      const res = await fetch(url, {
        method: editingProduct ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to save product')
      }

      toast.success(editingProduct ? 'Product updated' : 'Product created')
      mutate()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your UC packages and items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? 'Update the product details below'
                  : 'Fill in the details to create a new product'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Product Name</FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 660 UC"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="ucAmount">UC Amount</FieldLabel>
                    <Input
                      id="ucAmount"
                      type="number"
                      value={formData.ucAmount}
                      onChange={(e) => setFormData({ ...formData, ucAmount: Number(e.target.value) })}
                      min="0"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="price">Price ($)</FieldLabel>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      min="0"
                      required
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="originalPrice">Original Price ($)</FieldLabel>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      min="0"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      min="0"
                      max="100"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uc">UC Package</SelectItem>
                      <SelectItem value="royale-pass">Royale Pass</SelectItem>
                      <SelectItem value="crate">Crate</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPopular">Mark as Popular</Label>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingProduct ? (
                    'Update Product'
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="p-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const CategoryIcon = categoryIcons[product.category as keyof typeof categoryIcons] || Package
                return (
                  <div
                    key={product._id}
                    className="group relative rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/50"
                  >
                    <div className="absolute right-2 top-2 flex gap-1">
                      {product.isPopular && (
                        <Badge className="bg-accent text-accent-foreground">Popular</Badge>
                      )}
                      {product.discount && product.discount > 0 && (
                        <Badge variant="destructive">-{product.discount}%</Badge>
                      )}
                    </div>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CategoryIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">{product.name}</h3>
                    <p className="mb-2 text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                    {product.ucAmount > 0 && (
                      <p className="mb-2 text-sm font-medium text-primary">
                        {product.ucAmount.toLocaleString()} UC
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
