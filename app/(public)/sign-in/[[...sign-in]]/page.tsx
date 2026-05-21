import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center py-12 px-4">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/account"
        appearance={{
          variables: {
            colorPrimary:       '#e63946',
            colorBackground:    '#f1faee',
            colorText:          '#1d3557',
            colorTextSecondary: '#457b9d',
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
