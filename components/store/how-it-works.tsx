import { UserPlus, ShoppingCart, CreditCard, Zap } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for a free account in just a few seconds. Enter your PUBG ID for faster checkout.',
  },
  {
    icon: ShoppingCart,
    title: 'Select UC Package',
    description: 'Browse our store and choose the UC package that fits your needs. Add items to your cart.',
  },
  {
    icon: CreditCard,
    title: 'Complete Payment',
    description: 'Checkout securely with your preferred payment method. We support multiple payment options.',
  },
  {
    icon: Zap,
    title: 'Receive UC Instantly',
    description: 'Your UC will be delivered to your PUBG account within minutes. Check your in-game mail!',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Getting your PUBG UC is quick and easy. Follow these simple steps to top up your account.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-primary via-primary/50 to-primary lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Step Number */}
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <step.icon className="h-7 w-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
