'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart, type Product } from '@/lib/hooks/use-cart'
import { useAuth } from '@/lib/hooks/use-auth'
import { ShoppingCart, Zap, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }

    try {
      await addItem(product._id)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add item')
    }
  }

  const getCategoryIcon = () => {
    switch (product.category) {
      case 'uc':
        return <Zap className="h-8 w-8 text-primary" />
      case 'royale-pass':
        return <Star className="h-8 w-8 text-primary" />
      default:
        return <Zap className="h-8 w-8 text-primary" />
    }
  }

  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {product.isPopular && (
          <Badge className="bg-accent text-accent-foreground">
            Popular
          </Badge>
        )}
        {product.discount && product.discount > 0 && (
          <Badge variant="destructive">
            -{product.discount}%
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        {/* Icon/Image */}
        <div className="mb-4 flex h-24 items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
            {getCategoryIcon()}
          </div>
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3 className="mb-1 text-xl font-bold text-foreground">{product.name}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* UC Amount */}
          {product.ucAmount > 0 && (
            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-bold text-primary">{product.ucAmount.toLocaleString()} UC</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full gap-2 transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
