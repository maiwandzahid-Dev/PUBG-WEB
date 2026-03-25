import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  UserPlus, 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Zap, 
  CheckCircle,
  Shield,
  Clock,
  Headphones,
  ArrowRight
} from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up for a free account in seconds. You can optionally add your PUBG ID during registration for faster checkout.',
  },
  {
    step: 2,
    icon: Search,
    title: 'Browse UC Packages',
    description: 'Explore our store and find the perfect UC package for your needs. We offer various denominations at competitive prices.',
  },
  {
    step: 3,
    icon: ShoppingCart,
    title: 'Add to Cart',
    description: 'Select the UC packages you want and add them to your cart. You can purchase multiple packages in a single order.',
  },
  {
    step: 4,
    icon: CreditCard,
    title: 'Secure Checkout',
    description: 'Enter your PUBG Mobile ID and complete the payment. We support multiple secure payment methods.',
  },
  {
    step: 5,
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Once payment is confirmed, your UC will be delivered to your PUBG Mobile account within minutes.',
  },
  {
    step: 6,
    icon: CheckCircle,
    title: 'Enjoy Your UC',
    description: 'Check your in-game mail and start using your UC! Buy skins, Royale Pass, and more.',
  },
]

const faqs = [
  {
    question: 'How long does UC delivery take?',
    answer: 'Most orders are delivered within 2-5 minutes. In rare cases, it may take up to 24 hours during high traffic periods.',
  },
  {
    question: 'Is my payment secure?',
    answer: 'Yes! We use industry-standard SSL encryption and never store your payment details on our servers.',
  },
  {
    question: 'What if I enter the wrong PUBG ID?',
    answer: 'Please double-check your PUBG ID before checkout. If you entered the wrong ID, contact our support immediately.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Refunds are available for orders that have not been processed. Once UC is delivered, refunds cannot be issued.',
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes! Our support team is available 24/7 to help with any questions or issues you may have.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-card py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold text-foreground">How It Works</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Getting your PUBG UC is quick, easy, and secure. Follow these simple steps
              to top up your account in minutes.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((item) => (
                <Card key={item.step} className="relative border-border bg-background">
                  <CardContent className="p-6">
                    <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Why Choose Us?
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">100% Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level encryption protects all transactions. Your data is always safe with us.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Our automated system ensures your UC is delivered within minutes of payment.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our dedicated support team is always available to help with any questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border bg-background">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-semibold text-foreground">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of satisfied customers and top up your PUBG account today.
            </p>
            <Link href="/store">
              <Button size="lg" className="gap-2">
                Browse Store
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
