import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  FileQuestion,
  Send
} from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll respond within 24 hours',
    contact: 'support@pubgucstore.com',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    contact: 'Available 24/7',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We aim to resolve all issues quickly',
    contact: 'Average: 30 minutes',
  },
]

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Support Center</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Need help? Our support team is here to assist you 24/7. 
              Choose your preferred method of contact below.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            {contactMethods.map((method) => (
              <Card key={method.title} className="border-border bg-card text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">{method.title}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{method.description}</p>
                  <p className="font-medium text-primary">{method.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <FieldGroup>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="name">Your Name</FieldLabel>
                        <Input id="name" placeholder="John Doe" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <Input id="email" type="email" placeholder="you@example.com" />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="subject">Subject</FieldLabel>
                      <Input id="subject" placeholder="How can we help?" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="orderId">Order ID (Optional)</FieldLabel>
                      <Input id="orderId" placeholder="e.g., ABC123" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="message">Message</FieldLabel>
                      <Textarea 
                        id="message" 
                        placeholder="Please describe your issue in detail..."
                        rows={5}
                      />
                    </Field>
                    <Button className="w-full gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-primary" />
                    Common Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="mb-1 font-medium text-foreground">UC Not Received</h4>
                      <p className="text-sm text-muted-foreground">
                        If you haven&apos;t received your UC within 24 hours, please contact us 
                        with your order ID and PUBG ID.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="mb-1 font-medium text-foreground">Wrong PUBG ID</h4>
                      <p className="text-sm text-muted-foreground">
                        If you entered the wrong PUBG ID, contact us immediately before 
                        the order is processed.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="mb-1 font-medium text-foreground">Payment Failed</h4>
                      <p className="text-sm text-muted-foreground">
                        If your payment failed but you were charged, please provide 
                        the transaction details and we&apos;ll investigate.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="mb-1 font-medium text-foreground">Account Issues</h4>
                      <p className="text-sm text-muted-foreground">
                        Having trouble logging in? Use the password reset feature or 
                        contact us for assistance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <p className="text-center text-sm text-muted-foreground">
                    For urgent issues, please include your Order ID in your message 
                    to help us resolve your issue faster.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
