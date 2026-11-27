import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center py-12 px-4">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/account"
        appearance={{
          variables: {
            colorPrimary:       '#D9A93F',
            colorBackground:    '#141210',
            colorText:          '#F4ECDC',
            colorTextSecondary: '#A99F8C',
            colorInputBackground: '#1C1916',
            colorInputText:     '#F4ECDC',
            borderRadius:       '12px',
          },
          elements: {
            card: 'shadow-card rounded-2xl',
            headerTitle: 'font-display',
          },
        }}
      />
    </div>
  )
}
