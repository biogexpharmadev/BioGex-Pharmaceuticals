
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { syncQuoteRequestToGHL } from "@/lib/ghl"

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = quoteRequestSchema.parse(body)

    await syncQuoteRequestToGHL(validatedData)

    return NextResponse.json({ success: true, message: "Quote request processed" })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
