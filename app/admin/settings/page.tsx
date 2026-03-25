'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Shield, 
  Globe, 
  Bell,
  CheckCircle
} from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Store configuration and system settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Database Status */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Database
            </CardTitle>
            <CardDescription>MongoDB connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500/10 text-green-500 border-0">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="text-foreground">MongoDB Atlas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Authentication and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">JWT Auth</span>
                <Badge className="bg-green-500/10 text-green-500 border-0">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Password Hashing</span>
                <span className="text-foreground">bcrypt (12 rounds)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">HTTP-Only Cookies</span>
                <Badge className="bg-green-500/10 text-green-500 border-0">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Store Information
            </CardTitle>
            <CardDescription>Basic store configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Store Name</span>
                <span className="text-foreground">PUBG UC Store</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span className="text-foreground">USD ($)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500/10 text-green-500 border-0">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Email and notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Notifications</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Service</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
