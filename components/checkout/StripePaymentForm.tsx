'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
)

interface StripePaymentFormProps {
  clientSecret: string
  orderId: string
  amount: number
}

function PaymentFormInner({ orderId, amount }: { orderId: string; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const clearCart = useCartStore(s => s.clearCart)
  const [processing, setProcessing] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setProcessing(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/${orderId}?paid=1`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message ?? 'Payment failed')
        setProcessing(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        clearCart()
        router.push(`/order/${orderId}?paid=1`)
        return
      }

      toast.error('Payment could not be completed. Please try again.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || processing}
        className="w-full h-12 bg-brand-red text-white rounded-xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {processing ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>Pay A${amount.toFixed(2)}</>
        )}
      </button>
      <p className="text-center text-xs text-brand-muted/60">🔒 Secured by Stripe · Card details never stored on our servers</p>
    </div>
  )
}

export function StripePaymentForm({ clientSecret, orderId, amount }: StripePaymentFormProps) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <p className="text-red-600 text-sm">
        Payment is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment.
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#e63946',
            colorBackground: '#ffffff',
            colorText: '#1d3557',
            borderRadius: '12px',
          },
        },
      }}
    >
      <PaymentFormInner orderId={orderId} amount={amount} />
    </Elements>
  )
}
