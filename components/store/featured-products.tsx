'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import type { Product } from '@/lib/hooks/use-cart'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FeaturedProducts() {
  const { data, isLoading } = useSWR<{ products: Product[] }>(
    '/api/products?popular=true',
    fetcher
  )

  const products = data?.products ?? []

  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Popular UC Packages
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose from our most popular UC packages. Best prices guaranteed with instant delivery.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No products available at the moment.
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/store">
            <Button variant="outline" size="lg" className="group gap-2">
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
