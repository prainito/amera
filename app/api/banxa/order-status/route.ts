import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { BANXA_CONFIG } from "@/lib/services/banxa-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Create HMAC signature for authentication
    const nonce = Date.now().toString()
    const message = nonce
    const signature = crypto.createHmac("sha256", BANXA_CONFIG.SECRET).update(message).digest("hex")

    // Make the API call to Banxa
    const response = await fetch(`${BANXA_CONFIG.API_URL}/api/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "BX-NONCE": nonce,
        "BX-API-KEY": BANXA_CONFIG.API_KEY,
        "BX-SIGNATURE": signature,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: "Error from Banxa API", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      order: data.data.order,
    })
  } catch (error) {
    console.error("Error fetching Banxa order status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

