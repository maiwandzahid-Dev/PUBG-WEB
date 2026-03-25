import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Glow Effects */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 border-primary/50 px-4 py-1.5">
            <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
            Trusted by 100,000+ PUBG Players
          </Badge>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Get Your{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              PUBG UC
            </span>
            <br />
            Instantly & Securely
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            The fastest and most reliable way to top up your PUBG Mobile account. 
            Best prices, instant delivery, and 24/7 customer support.
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/store">
              <Button size="lg" className="group gap-2 px-8 text-base font-semibold">
                Browse Store
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="px-8 text-base font-semibold">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">100K+</span>
              <span className="text-sm text-muted-foreground">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">5M+</span>
              <span className="text-sm text-muted-foreground">UC Delivered</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">{"<"}2min</span>
              <span className="text-sm text-muted-foreground">Avg. Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">4.9/5</span>
              <span className="text-sm text-muted-foreground">Customer Rating</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Instant Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Receive your UC within minutes of purchase. Our automated system ensures fast delivery.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">100% Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your transactions are protected with bank-level encryption. Shop with confidence.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Our support team is available around the clock to help with any questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
