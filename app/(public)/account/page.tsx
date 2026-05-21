'use client'

import Link from 'next/link'
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Package, Heart, MapPin, Mail } from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-brand-cream py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Show when="signed-out">
          <div className="bg-white rounded-2xl p-8 shadow-card text-center">
            <h1 className="font-display text-2xl text-brand-navy mb-2">Your Account</h1>
            <p className="text-brand-muted text-sm mb-6">
              Sign in to track orders, manage your profile and sync saved items across devices.
            </p>
            <SignInButton mode="modal">
              <button type="button" className="w-full h-12 bg-brand-red text-white rounded-xl font-semibold mb-3">
                Sign In
              </button>
            </SignInButton>
            <Link href="/sign-up" className="text-brand-steel text-sm hover:text-brand-red">
              Create an account →
            </Link>
            <div className="mt-8 pt-6 border-t border-gray-100 text-left space-y-3">
              <p className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Without signing in</p>
              <Link href="/saved" className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-red">
                <Heart size={16} /> View saved items (on this device)
              </Link>
              <Link href="/shop" className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-red">
                <Package size={16} /> Continue shopping
              </Link>
            </div>
          </div>
        </Show>

        <Show when="signed-in">
          <AccountDashboard />
        </Show>
      </div>
    </div>
  )
}

function AccountDashboard() {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? ''

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-card flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-brand-navy">
            Hello, {user?.firstName ?? 'there'}
          </h1>
          <p className="text-brand-muted text-sm mt-1 flex items-center gap-1.5">
            <Mail size={14} /> {email}
          </p>
        </div>
        <UserButton />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card space-y-3">
        <h2 className="font-semibold text-brand-navy text-sm">Quick links</h2>
        <Link href="/saved" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-cream transition-colors">
          <Heart size={18} className="text-brand-red" />
          <span className="text-sm text-brand-navy">Saved items</span>
        </Link>
        <Link href="/shop" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-cream transition-colors">
          <Package size={18} className="text-brand-red" />
          <span className="text-sm text-brand-navy">Shop all products</span>
        </Link>
        <a href={`mailto:hello@amazora.com.au?subject=Order enquiry — ${email}`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-cream transition-colors">
          <MapPin size={18} className="text-brand-red" />
          <span className="text-sm text-brand-navy">Contact support about an order</span>
        </a>
      </div>

      <p className="text-center text-xs text-brand-muted/70 px-4">
        Order confirmations are sent to your checkout email. For order status, reply to your confirmation email or contact support with your order number.
      </p>
    </div>
  )
}
