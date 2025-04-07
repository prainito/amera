// Define token information type
export type TokenInfo = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  price?: number
  id?: string // Add CoinGecko ID for price chart
}

// Update the mock token lists with proper data
const ETHEREUM_TOKENS: TokenInfo[] = [
  {
    chainId: 1,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png",
    price: 3500,
    id: "ethereum",
  },
  {
    chainId: 1,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png",
    price: 1,
    id: "usd-coin",
  },
  {
    chainId: 1,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    name: "Tether",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
    price: 1,
  },
  {
    chainId: 1,
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    decimals: 8,
    logoURI: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png",
    price: 65000,
  },
  {
    chainId: 1,
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png",
    price: 1,
  },
]

const BASE_TOKENS: TokenInfo[] = [
  {
    chainId: 8453,
    address: "0x4200000000000000000000000000000000000006",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png",
    price: 3500,
  },
  {
    chainId: 8453,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png",
    price: 1,
  },
  {
    chainId: 8453,
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    name: "Tether",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
    price: 1,
  },
  {
    chainId: 8453,
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    name: "Coinbase Wrapped Staked ETH",
    symbol: "cbETH",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/27008/thumb/cbeth.png",
    price: 3800,
  },
]

const TRON_TOKENS: TokenInfo[] = [
  {
    chainId: 1000001, // Custom ID for TRON
    address: "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf", // Mock address for WTRX
    name: "Wrapped TRON",
    symbol: "WTRX",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/1094/thumb/tron-logo.png",
    price: 0.12,
  },
  {
    chainId: 1000001,
    address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png",
    price: 1,
  },
  {
    chainId: 1000001,
    address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    name: "Tether",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
    price: 1,
  },
  {
    chainId: 1000001,
    address: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
    name: "JUST",
    symbol: "JST",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/12330/thumb/just-logo.png",
    price: 0.03,
  },
]

/**
 * Get available tokens for a specific chain
 */
export async function getTokensForChain(chainId: number): Promise<TokenInfo[]> {
  try {
    // In a real implementation, we would fetch this from an API
    switch (chainId) {
      case 1:
        return ETHEREUM_TOKENS
      case 8453:
        return BASE_TOKENS
      case 1000001:
        return TRON_TOKENS
      default:
        return ETHEREUM_TOKENS
    }
  } catch (error) {
    console.error("Error getting tokens for chain:", error)
    return []
  }
}

/**
 * Get token price from Uniswap (mock implementation)
 */
export async function getTokenPrice(chainId: number, tokenAddress: string): Promise<number> {
  // In a real implementation, we would call Uniswap's API
  // For now, return mock data

  const tokens = await getTokensForChain(chainId)
  const token = tokens.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase())

  return token?.price || 0
}

/**
 * Get swap quote from Uniswap
 */
export async function getSwapQuote(
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string,
): Promise<{
  toAmount: string
  priceImpact: string
  route: string[]
}> {
  // In a real implementation, we would call Uniswap's API
  // For now, return mock data

  const tokens = await getTokensForChain(chainId)
  const fromTokenInfo = tokens.find((t) => t.address.toLowerCase() === fromToken.toLowerCase())
  const toTokenInfo = tokens.find((t) => t.address.toLowerCase() === toToken.toLowerCase())

  if (!fromTokenInfo || !toTokenInfo) {
    throw new Error("Token not found")
  }

  const rate = fromTokenInfo.price / toTokenInfo.price
  const toAmount = (Number.parseFloat(amount) * rate).toString()

  return {
    toAmount,
    priceImpact: (Math.random() * 0.5).toFixed(2) + "%",
    route: [fromTokenInfo.symbol, toTokenInfo.symbol],
  }
}

/**
 * Execute swap on Uniswap
 */
export async function executeSwap(
  provider: any,
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string,
  slippage: number,
): Promise<{ hash: string }> {
  // In a real implementation, we would use Uniswap's SDK to execute the swap
  // For now, return a mock transaction hash

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    hash: "0x" + Math.random().toString(16).substring(2, 66),
  }
}

/**
 * Check if Uniswap is available on the current chain
 */
export function isUniswapSupportedOnChain(chainId: number): boolean {
  // Uniswap is available on Ethereum and BASE
  // For TRON, we would use a different DEX like JustSwap
  return [1, 8453, 1000001].includes(chainId)
}

/**
 * Get the appropriate DEX name for the current chain
 */
export function getDexNameForChain(chainId: number): string {
  switch (chainId) {
    case 1: // Ethereum
    case 8453: // BASE
      return "Uniswap"
    case 1000001: // TRON
      return "SunSwap" // TRON's DEX
    default:
      return "Uniswap"
  }
}

