"use client"

// Cache to store API responses and reduce API calls
const CACHE = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Base URL for CoinGecko API
const API_BASE_URL = "https://api.coingecko.com/api/v3"

// Coin IDs for fetching market data (example)
const COIN_IDS = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  usdc: "usd-coin",
  // Add more coin IDs as needed
}

/**
 * Fetches data from CoinGecko API with caching and rate limiting
 */
async function fetchWithCache(endpoint: string) {
  const url = `${API_BASE_URL}${endpoint}`

  // Check if we have a valid cached response
  if (CACHE[url] && Date.now() - CACHE[url].timestamp < CACHE_DURATION) {
    return CACHE[url].data
  }

  try {
    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))

    const response = await fetch(url)

    if (response.status === 429) {
      throw new Error("Rate limit exceeded")
    }

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Cache the response
    CACHE[url] = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error)
    throw error
  }
}

/**
 * Gets the current price of specified coins in USD
 */
async function getCoinPrices(coinIds) {
  try {
    const ids = coinIds.join(",")
    const data = await fetchWithCache(`/simple/price?ids=${ids}&vs_currencies=usd`)

    // Transform the response to a simpler format
    const prices = {}
    for (const id of coinIds) {
      if (data[id]) {
        prices[id] = data[id].usd
      }
    }

    return prices
  } catch (error) {
    console.error("Error getting coin prices:", error)
    return {} // Return empty object on error
  }
}

/**
 * Gets detailed market data for specified coins
 */
async function getMarketData(coinIds = Object.values(COIN_IDS), currency = "usd", perPage = 50, page = 1) {
  try {
    const ids = coinIds.join(",")
    const data = await fetchWithCache(
      `/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`,
    )

    return data
  } catch (error) {
    console.error("Error getting market data:", error)
    return [] // Return empty array on error
  }
}

/**
 * Search for coins by query
 */
async function searchCoins(query) {
  if (!query || query.length < 2) return []

  try {
    const data = await fetchWithCache(`/search?query=${encodeURIComponent(query)}`)
    return data.coins || []
  } catch (error) {
    console.error("Error searching coins:", error)
    return []
  }
}

/**
 * Gets trending coins in the last 24 hours
 */
async function getTrendingCoins() {
  try {
    const data = await fetchWithCache("/search/trending")
    return data.coins || []
  } catch (error) {
    console.error("Error getting trending coins:", error)
    return []
  }
}

/**
 * Gets global crypto market data
 */
async function getGlobalData() {
  try {
    const data = await fetchWithCache("/global")
    return data.data || {}
  } catch (error) {
    console.error("Error getting global data:", error)
    return {}
  }
}

/**
 * Formats a price with the proper currency symbol and decimals
 */
function formatPrice(price, currency = "usd") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  })

  return formatter.format(price)
}

/**
 * Formats a percentage change with the proper sign and decimals
 */
function formatPercentage(percentage) {
  const sign = percentage >= 0 ? "+" : ""
  return `${sign}${percentage.toFixed(2)}%`
}

/**
 * Gets the color class for a percentage change
 */
function getPercentageColorClass(percentage) {
  return percentage >= 0 ? "text-green-500" : "text-red-500"
}

export const coingeckoService = {
  COIN_IDS,
  getCoinPrices,
  getMarketData,
  getTrendingCoins,
  getGlobalData,
  searchCoins,
  formatPrice,
  formatPercentage,
  getPercentageColorClass,
}

