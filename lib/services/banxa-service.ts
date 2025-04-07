// Banxa API integration service
// This service handles interactions with Banxa's API for on/off ramp services

// Configuration for Banxa API
export const BANXA_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_BANXA_API_URL || "https://api.banxa.com",
  PARTNER_ID: process.env.BANXA_PARTNER_ID || "",
  API_KEY: process.env.BANXA_API_KEY || "",
  SECRET: process.env.BANXA_SECRET || "",
}

// Types for Banxa API responses and requests
export interface BanxaOrderParams {
  accountReference?: string // User's wallet address or reference
  source: string // Source currency code (e.g., 'USD', 'EUR')
  target: string // Target cryptocurrency code (e.g., 'BTC', 'ETH')
  sourceAmount?: number // Amount in source currency
  targetAmount?: number // Amount in target cryptocurrency
  returnUrlOnSuccess: string // URL to redirect after successful transaction
  returnUrlOnFailure: string // URL to redirect after failed transaction
  returnUrlOnCancelled: string // URL to redirect after cancelled transaction
  walletAddress: string // Cryptocurrency wallet address
  walletAddressTag?: string // Optional tag for certain cryptocurrencies
  customerEmail?: string // Customer's email address
}

export interface BanxaOrderResponse {
  data: {
    order: {
      id: string
      accountReference: string
      source: string
      target: string
      sourceAmount: string
      targetAmount: string
      checkout: {
        id: string
        url: string
      }
    }
  }
}

// Function to create a Banxa order (client-side)
export async function createBanxaOrder(params: BanxaOrderParams): Promise<string> {
  try {
    // In a real implementation, this would call a server-side API route
    // that would handle the authentication and API call to Banxa
    const response = await fetch("/api/banxa/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Error creating Banxa order: ${response.statusText}`)
    }

    const data = await response.json()
    return data.checkoutUrl
  } catch (error) {
    console.error("Error creating Banxa order:", error)
    throw error
  }
}

// Function to get supported currencies from Banxa
export async function getBanxaSupportedCurrencies(): Promise<any> {
  try {
    const response = await fetch("/api/banxa/currencies")

    if (!response.ok) {
      throw new Error(`Error fetching Banxa currencies: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Banxa currencies:", error)
    throw error
  }
}

// Function to get order status from Banxa
export async function getBanxaOrderStatus(orderId: string): Promise<any> {
  try {
    const response = await fetch(`/api/banxa/order-status?orderId=${orderId}`)

    if (!response.ok) {
      throw new Error(`Error fetching Banxa order status: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Banxa order status:", error)
    throw error
  }
}

