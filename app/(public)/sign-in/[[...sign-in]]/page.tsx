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
