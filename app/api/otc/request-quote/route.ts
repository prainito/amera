import { type NextRequest, NextResponse } from "next/server"
import type { OTCRequestParams } from "@/lib/services/otc-service"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const body: OTCRequestParams = await request.json()

    // Validate required parameters
    if (
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.amount ||
      !body.currency ||
      !body.targetCurrency ||
      !body.direction
    ) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Validate minimum amount
    if (body.amount < 50000) {
      return NextResponse.json(
        { error: "OTC service is only available for transactions of $50,000 or more" },
        { status: 400 },
      )
    }

    // In a real implementation, this would call your OTC service or database
    // For now, we'll create a mock quote

    // Calculate fee (20-30 basis points)
    let feePercentage = 0.3 // 30 basis points
    if (body.amount >= 100000) {
      feePercentage = 0.25 // 25 basis points for $100K+
    }
    if (body.amount >= 500000) {
      feePercentage = 0.2 // 20 basis points for $500K+
    }

    const fee = body.amount * (feePercentage / 100)

    // Mock exchange rate
    const exchangeRate =
      body.currency === "USD" && body.targetCurrency === "BTC"
        ? 0.000033 // ~$30,000 per BTC
        : 1

    const targetAmount = (body.amount - fee) * exchangeRate

    // Create a mock quote
    const quote = {
      id: uuidv4(),
      amount: body.amount,
      currency: body.currency,
      targetAmount,
      targetCurrency: body.targetCurrency,
      exchangeRate,
      fee,
      feePercentage,
      expiresAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
    }

    // In a real implementation, save the quote to your database

    // Send email notification to OTC team (mock)
    console.log(`OTC Request from ${body.name} (${body.email}) for ${body.amount} ${body.currency}`)

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Error processing OTC quote request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

