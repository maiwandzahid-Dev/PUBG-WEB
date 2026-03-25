import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { HeroSection } from '@/components/store/hero-section'
import { FeaturedProducts } from '@/components/store/featured-products'
import { HowItWorks } from '@/components/store/how-it-works'
import { Testimonials } from '@/components/store/testimonials'
import { DatabaseSeeder } from '@/components/store/database-seeder'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
      <DatabaseSeeder />
    </div>
  )
}
