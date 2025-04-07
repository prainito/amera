// Cache to store API responses and reduce API calls
const CACHE: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Base URL for CoinGecko API
const API_BASE_URL = "https://api.coingecko.com/api/v3"

// Type for coin market data
export type CoinMarketData = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

// Type for token info
export type TokenInfo = {
  id: string
  symbol: string
  name: string
  image: string
  current_price?: number
  market_cap?: number
  market_cap_rank?: number
}

// Add these types at the top of the file
export type TimeRange = "1h" | "4h" | "24h" | "7d" | "30d" | "1y"
export type PricePoint = {
  timestamp: number
  price: number
}

// Coin IDs for fetching market data (example)
const COIN_IDS = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  usdc: "usd-coin",
  // Add more coin IDs as needed
}

// Add these constants
const TIME_RANGES = {
  "1h": { days: 0.0417, interval: "minutely" },
  "4h": { days: 0.1667, interval: "minutely" },
  "24h": { days: 1, interval: "hourly" },
  "7d": { days: 7, interval: "hourly" },
  "30d": { days: 30, interval: "daily" },
  "1y": { days: 365, interval: "daily" },
} as const

/**
 * Fetches data from CoinGecko API with caching and rate limiting
 */
async function fetchWithCache(endpoint: string): Promise<any> {
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

    // Return cached data if available, even if expired
    if (CACHE[url]) {
      console.log("Using expired cache due to API error")
      return CACHE[url].data
    }

    throw error
  }
}

/**
 * Gets the top 500 tokens by market cap
 */
export async function getTop500Tokens(): Promise<TokenInfo[]> {
  try {
    const data = await fetchWithCache(
      "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=500&sparkline=false",
    )

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
    }))
  } catch (error) {
    console.error("Error getting top tokens:", error)
    return []
  }
}

/**
 * Search for tokens by query
 */
export async function searchTokens(query: string): Promise<TokenInfo[]> {
  if (!query || query.length < 2) return []

  try {
    // First try to search in the top 500 tokens cache
    const cacheKey = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=500&sparkline=false"
    let tokens: TokenInfo[] = []

    if (CACHE[cacheKey] && CACHE[cacheKey].data) {
      const topTokens = CACHE[cacheKey].data
      const searchLower = query.toLowerCase()

      tokens = topTokens
        .filter(
          (coin: any) =>
            coin.id.includes(searchLower) ||
            coin.symbol.toLowerCase().includes(searchLower) ||
            coin.name.toLowerCase().includes(searchLower),
        )
        .map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
        }))
    }

    // If we don't have enough results, try the search API
    if (tokens.length < 10) {
      const searchData = await fetchWithCache(`/search?query=${encodeURIComponent(query)}`)

      // Get additional token details for the search results
      const searchIds = searchData.coins
        .slice(0, 20)
        .map((coin: any) => coin.id)
        .join(",")

      if (searchIds) {
        const detailedData = await fetchWithCache(
          `/coins/markets?vs_currency=usd&ids=${searchIds}&order=market_cap_desc&sparkline=false`,
        )

        const searchTokens = detailedData.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
        }))

        // Merge results, removing duplicates
        const existingIds = new Set(tokens.map((t) => t.id))
        tokens = [...tokens, ...searchTokens.filter((t) => !existingIds.has(t.id))]
      }
    }

    // Sort by market cap rank
    return tokens.sort((a, b) => (a.market_cap_rank || 999) - (b.market_cap_rank || 999))
  } catch (error) {
    console.error("Error searching tokens:", error)
    return []
  }
}

/**
 * Gets token details by ID
 */
export async function getTokenDetails(tokenId: string): Promise<TokenInfo | null> {
  try {
    const data = await fetchWithCache(
      `/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    )

    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      image: data.image.large,
      current_price: data.market_data?.current_price?.usd,
      market_cap: data.market_data?.market_cap?.usd,
      market_cap_rank: data.market_cap_rank,
    }
  } catch (error) {
    console.error("Error getting token details:", error)
    return null
  }
}

/**
 * Gets the current price of specified coins in USD
 */
export async function getCoinPrices(coinIds: string[]): Promise<Record<string, number>> {
  try {
    const ids = coinIds.join(",")
    const data = await fetchWithCache(`/simple/price?ids=${ids}&vs_currencies=usd`)

    // Transform the response to a simpler format
    const prices: Record<string, number> = {}
    for (const id of coinIds) {
      if (data[id]) {
        prices[id] = data[id].usd
      }
    }

    return prices
  } catch (error) {
    console.error("Error getting coin prices:", error)
    // Return empty object on error
    return {}
  }
}

/**
 * Gets detailed market data for specified coins
 */
export async function getMarketData(
  coinIds: string[] = Object.values(COIN_IDS),
  currency = "usd",
  perPage = 50,
  page = 1,
): Promise<CoinMarketData[]> {
  try {
    const ids = coinIds.join(",")
    const data = await fetchWithCache(
      `/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`,
    )

    return data
  } catch (error) {
    console.error("Error getting market data:", error)
    // Return empty array on error
    return []
  }
}

/**
 * Search for coins by query
 */
export async function searchCoins(query: string): Promise<any[]> {
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
export async function getTrendingCoins(): Promise<any[]> {
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
export async function getGlobalData(): Promise<any> {
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
export function formatPrice(price: number, currency = "usd"): string {
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
export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? "+" : ""
  return `${sign}${percentage.toFixed(2)}%`
}

/**
 * Gets the color class for a percentage change
 */
export function getPercentageColorClass(percentage: number): string {
  return percentage >= 0 ? "text-green-500" : "text-red-500"
}

// Add this function to fetch historical price data
export async function getHistoricalPrices(
  coinId: string,
  timeRange: TimeRange,
  currency = "usd",
): Promise<PricePoint[]> {
  try {
    const { days, interval } = TIME_RANGES[timeRange]
    const data = await fetchWithCache(
      `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}&interval=${interval}`,
    )

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }))
  } catch (error) {
    console.error("Error fetching historical prices:", error)
    return []
  }
}

export default {
  COIN_IDS,
  getCoinPrices,
  getMarketData,
  getTrendingCoins,
  getGlobalData,
  searchCoins,
  formatPrice,
  formatPercentage,
  getPercentageColorClass,
  getTop500Tokens,
  searchTokens,
  getTokenDetails,
  getHistoricalPrices,
  TIME_RANGES,
}

