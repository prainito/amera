import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { BANXA_CONFIG, type BanxaOrderParams } from "@/lib/services/banxa-service"

export async function POST(request: NextRequest) {
  try {
    const body: BanxaOrderParams = await request.json()

    // Validate required parameters
    if (!body.source || !body.target || !body.walletAddress || (!body.sourceAmount && !body.targetAmount)) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create the request payload
    const payload = {
      account_reference: body.accountReference || body.walletAddress,
      source: body.source,
      target: body.target,
      source_amount: body.sourceAmount ? body.sourceAmount.toString() : undefined,
      target_amount: body.targetAmount ? body.targetAmount.toString() : undefined,
      return_url_on_success: body.returnUrlOnSuccess,
      return_url_on_failure: body.returnUrlOnFailure,
      return_url_on_cancelled: body.returnUrlOnCancelled,
      wallet_address: body.walletAddress,
      wallet_address_tag: body.walletAddressTag,
      customer_email: body.customerEmail,
      partner_data: {
        partner_id: BANXA_CONFIG.PARTNER_ID,
      },
    }

    // Create HMAC signature for authentication
    const nonce = Date.now().toString()
    const message = nonce + JSON.stringify(payload)
    const signature = crypto.createHmac("sha256", BANXA_CONFIG.SECRET).update(message).digest("hex")

    // Make the API call to Banxa
    const response = await fetch(`${BANXA_CONFIG.API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BX-NONCE": nonce,
        "BX-API-KEY": BANXA_CONFIG.API_KEY,
        "BX-SIGNATURE": signature,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: "Error from Banxa API", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      orderId: data.data.order.id,
      checkoutUrl: data.data.checkout.url,
    })
  } catch (error) {
    console.error("Error creating Banxa order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

