import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { syncQuoteRequestToGHL } from '@/lib/ghl'

const quoteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().optional(),
  products: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1)
  })).min(1, "At least one product must be selected")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = quoteRequestSchema.parse(body)

    // GHL sync is best-effort: never block or fail the request on its account
    try {
      await syncQuoteRequestToGHL(data)
    } catch (err) {
      console.error('GHL sync failed (non-blocking):', err)
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const productRows = data.products
      .map(
        (p) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${p.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${p.quantity}</td>
              </tr>`
      )
      .join('')

    const adminEmail = {
      from: process.env.SMTP_USER,
      to: 'info@biogexpharma.com',
      replyTo: data.email,
      subject: `New Quote Request: ${data.companyName} (${data.products.length} item${data.products.length > 1 ? 's' : ''})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2e7d32; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <img src="https://res.cloudinary.com/ddkkfumkl/image/upload/v1754313216/logofullbgless_mve3s2.png" alt="BioGex Pharmaceuticals" style="height: 40px; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px;">BioGex Pharmaceuticals</h1>
          </div>

          <div style="background-color: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; margin-top: 0;">
              New Quote Request
            </h2>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Requester Details:</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Company:</strong> ${data.companyName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Requested Products:</h3>
              <table style="width: 100%; border-collapse: collapse; background-color: white;">
                <thead>
                  <tr style="background-color: #e8f5e8;">
                    <th style="padding: 10px; text-align: left; color: #2e7d32;">Product</th>
                    <th style="padding: 10px; text-align: center; color: #2e7d32; width: 100px;">Qty (Pkts)</th>
                  </tr>
                </thead>
                <tbody>${productRows}
                </tbody>
              </table>
            </div>

            ${data.message ? `
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Additional Message:</h3>
              <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2e7d32;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>` : ''}

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

    const customerEmail = {
      from: process.env.SMTP_USER || 'info@biogexpharma.com',
      to: data.email,
      subject: 'We Received Your Quote Request - BioGex Pharmaceuticals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2e7d32; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <img src="https://res.cloudinary.com/ddkkfumkl/image/upload/v1754313216/logofullbgless_mve3s2.png" alt="BioGex Pharmaceuticals" style="height: 40px; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px;">BioGex Pharmaceuticals</h1>
          </div>

          <div style="background-color: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2e7d32; margin-top: 0;">Thank you for your quote request!</h2>

            <p>Dear ${data.name},</p>

            <p>We've received your request for a quote and our team is preparing it now. You'll hear back from us within 24-48 hours.</p>

            <div style="margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Requested Products:</h3>
              <table style="width: 100%; border-collapse: collapse; background-color: white;">
                <thead>
                  <tr style="background-color: #e8f5e8;">
                    <th style="padding: 10px; text-align: left; color: #2e7d32;">Product</th>
                    <th style="padding: 10px; text-align: center; color: #2e7d32; width: 100px;">Qty (Pkts)</th>
                  </tr>
                </thead>
                <tbody>${productRows}
                </tbody>
              </table>
            </div>

            <p>If you have any urgent inquiries, please don't hesitate to call us at <strong>+254 748 763980</strong>.</p>

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

    await transporter.sendMail(adminEmail)
    await transporter.sendMail(customerEmail)

    return NextResponse.json({ success: true, message: 'Quote request submitted successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Quote email error:', error)
    return NextResponse.json({ error: 'Failed to submit quote request. Please try again later.' }, { status: 500 })
  }
}
