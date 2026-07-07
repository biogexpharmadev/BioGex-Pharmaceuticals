import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { syncContactFormToGHL } from '@/lib/ghl'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // GHL sync is best-effort: never block or fail the request on its account
    try {
      await syncContactFormToGHL({ name, email, phone, subject, message })
    } catch (err) {
      console.error('GHL sync failed (non-blocking):', err)
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PASSWORD ,
      },
    })

    // Email to admin
    const adminEmail = {
      from: process.env.SMTP_USER,
      to: 'info@biogexpharma.com',
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2e7d32; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <img src="https://res.cloudinary.com/ddkkfumkl/image/upload/v1754313216/logofullbgless_mve3s2.png" alt="BioGex Pharmaceuticals" style="height: 40px; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px;">BioGex Pharmaceuticals</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; margin-top: 0;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2e7d32;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                <strong>Submission Time:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Office 7, The Close, Ngara Road, Nairobi, Kenya<br>
            Phone: +254 748 763980 | Email: info@biogexpharma.com</p>
          </div>
        </div>
      `,
    }

    // Auto-reply to customer
    const customerEmail = {
      from: process.env.SMTP_USER || 'info@biogexpharma.com',
      to: email,
      subject: 'Thank you for contacting BioGex Pharmaceuticals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2e7d32; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <img src="https://res.cloudinary.com/ddkkfumkl/image/upload/v1754313216/logofullbgless_mve3s2.png" alt="BioGex Pharmaceuticals" style="height: 40px; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px;">BioGex Pharmaceuticals</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2e7d32; margin-top: 0;">Thank you for contacting us!</h2>
            
            <p>Dear ${name},</p>
            
            <p>We have received your message and appreciate you taking the time to reach out to us. Our team will review your inquiry and get back to you within 24-48 hours.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2e7d32;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p>If you have any urgent inquiries, please don't hesitate to call us at <strong>+254 748 763980</strong>.</p>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h4 style="color: #2e7d32; margin-top: 0;">What happens next?</h4>
              <ul style="color: #555;">
                <li>Our team will review your inquiry</li>
                <li>We'll contact you within 24-48 hours</li>
                <li>We'll provide personalized solutions for your pharmaceutical needs</li>
              </ul>
            </div>
            
            <p>Best regards,<br>
            <strong>The BioGex Pharmaceuticals Team</strong></p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Office 7, The Close, Ngara Road, Nairobi, Kenya<br>
            Phone: +254 748 763980 | Email: info@biogexpharma.com</p>
          </div>
        </div>
      `,
    }

    // Send both emails
    await transporter.sendMail(adminEmail)
    await transporter.sendMail(customerEmail)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send email. Please try again later.' 
      },
      { status: 500 }
    )
  }
} 