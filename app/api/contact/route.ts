import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Here you would typically send an email using a service like:
    // - Resend (recommended for Vercel)
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    
    // For now, we'll log the message and return success
    // In production, integrate with your preferred email service
    
    console.log("=== New Contact Form Submission ===")
    console.log(`From: ${name} <${email}>`)
    console.log(`Message: ${message}`)
    console.log("===================================")

    // If you want to add email sending, install resend and add:
    // 
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // 
    // await resend.emails.send({
    //   from: 'Portfolio Contact <onboarding@resend.dev>',
    //   to: 'wendyangelicavega@gmail.com',
    //   subject: `New message from ${name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // })

    return NextResponse.json(
      { success: true, message: "Message received successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
