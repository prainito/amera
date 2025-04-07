// OTC (Over-The-Counter) service for large transactions

export interface OTCRequestParams {
  name: string
  email: string
  phone: string
  amount: number
  currency: string
  targetCurrency: string
  direction: "buy" | "sell"
  additionalInfo?: string
}

export interface OTCQuote {
  id: string
  amount: number
  currency: string
  targetAmount: number
  targetCurrency: string
  exchangeRate: number
  fee: number
  feePercentage: number
  expiresAt: string
}

// Function to request an OTC quote
export async function requestOTCQuote(params: OTCRequestParams): Promise<OTCQuote> {
  try {
    const response = await fetch("/api/otc/request-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Error requesting OTC quote: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error requesting OTC quote:", error)
    throw error
  }
}

// Function to accept an OTC quote
export async function acceptOTCQuote(quoteId: string): Promise<{ success: boolean; reference: string }> {
  try {
    const response = await fetch("/api/otc/accept-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quoteId }),
    })

    if (!response.ok) {
      throw new Error(`Error accepting OTC quote: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error accepting OTC quote:", error)
    throw error
  }
}

// Calculate OTC fee based on amount (20-30 basis points)
export function calculateOTCFee(amount: number): { fee: number; percentage: number } {
  // Base fee is 30 basis points (0.3%)
  let percentage = 0.3

  // For larger amounts, reduce the fee percentage
  if (amount >= 100000) {
    percentage = 0.25 // 25 basis points for $100K+
  }
  if (amount >= 500000) {
    percentage = 0.2 // 20 basis points for $500K+
  }

  const fee = amount * (percentage / 100)

  return { fee, percentage }
}

