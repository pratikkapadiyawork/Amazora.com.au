import { prisma }         from '@/lib/db'
import { resend }         from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'
import { z }              from 'zod'

const schema = z.object({
  email: z.string().email(),
  name:  z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { email, name } = parsed.data

    await prisma.subscriber.upsert({
      where:  { email },
      update: { isActive: true },
      create: { email, name, source: 'website' },
    })

    // Send welcome email — wrapped so a Resend failure doesn't break subscription
    try {
      await resend.emails.send({
        from:    `Amazora <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`,
        to:      email,
        subject: 'Welcome to Amazora 🌹',
        html: `
          <div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#FAF7F8;">
            <h1 style="font-family:Georgia,serif;color:#0C0420;font-size:28px;margin:0 0 8px;">
              <span style="color:#D391B0;">A</span>mazora
            </h1>
            <p style="color:#7B466A;margin:0 0 24px;">🇦🇺 Premium Australian Marketplace</p>
            <h2 style="font-family:Georgia,serif;color:#0C0420;">Welcome aboard!</h2>
            <p style="color:#5D3C64;line-height:1.7;">
              Thank you for subscribing. You&apos;ll be the first to know about new arrivals,
              exclusive offers and gift inspiration.
            </p>
            <a href="https://amazora.com.au/shop"
              style="display:inline-block;margin-top:24px;padding:14px 32px;background:#D391B0;color:#fff;text-decoration:none;border-radius:12px;font-weight:700;">
              Start Shopping →
            </a>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Welcome email failed (non-critical):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
