import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Maiwand Khan.',
    location: 'Afghanistan',
    rating: 5,
    text: 'Super fast delivery! Got my UC in less than 2 minutes. Best UC store I have ever used.',
  },
  {
    name: 'Raj S.',
    location: 'India',
    rating: 5,
    text: 'Great prices and instant delivery. Customer support is very helpful. Highly recommended!',
  },
  {
    name: 'Mohammed Ali.',
    location: 'UAE',
    rating: 5,
    text: 'I have been using this store for months. Always reliable and the UC arrives instantly.',
  },
  {
    name: 'Sarah M.',
    location: 'USA',
    rating: 5,
    text: 'The best UC store out there. Competitive prices and amazing customer service.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Join thousands of satisfied PUBG players who trust us for their UC needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-background">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-4 text-sm text-muted-foreground">
                  &quot;{testimonial.text}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
