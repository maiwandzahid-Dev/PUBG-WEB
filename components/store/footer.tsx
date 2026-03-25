import Link from 'next/link'
import { Gamepad2, Shield, Clock, Headphones } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Secure Payments</h4>
            <p className="text-sm text-muted-foreground">256-bit SSL encryption</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Instant Delivery</h4>
            <p className="text-sm text-muted-foreground">UC delivered in minutes</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">Always here to help</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">100K+ Gamers</h4>
            <p className="text-sm text-muted-foreground">Trust our service</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">PUBG UC Store</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted source for PUBG Mobile UC top-ups. Fast, secure, and reliable.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/store" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} PUBG UC Store. All rights reserved. Not affiliated with PUBG Corporation or Krafton.
          </p>
        </div>
      </div>
    </footer>
  )
}
