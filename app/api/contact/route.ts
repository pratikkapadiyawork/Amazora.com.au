import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SITE } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json() as {
      name?: string
      email?: string
      subject?: string
      message?: string
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 })
    }

    const resend = new Resend(resendKey)
    const to = process.env.CONTACT_EMAIL ?? SITE.support

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'Amazora <onboarding@resend.dev>',
      to:      [to],
      replyTo: email,
      subject: subject?.trim() ? `[Amazora] ${subject}` : `[Amazora] Contact from ${name}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject ?? 'General enquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
