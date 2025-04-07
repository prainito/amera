// Define types for token balances
export type TokenBalance = {
  symbol: string
  balance: string
  address: string
  image?: string // Add image URL
  name?: string // Add token name
}

// Common token addresses with CoinGecko IDs
const TOKEN_ADDRESSES: Record<number, Record<string, { address: string; coingeckoId: string }>> = {
  1: {
    // Ethereum Mainnet
    USDC: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      coingeckoId: "usd-coin",
    },
    USDT: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      coingeckoId: "tether",
    },
    DAI: {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      coingeckoId: "dai",
    },
  },
  8453: {
    // BASE Chain (Ethereum L2)
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      coingeckoId: "usd-coin",
    },
    USDT: {
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      coingeckoId: "tether",
    },
    DAI: {
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      coingeckoId: "dai",
    },
  },
  1000001: {
    // Using a custom ID for TRON
    // TRON Chain
    USDC: {
      address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8", // USDC on TRON
      coingeckoId: "usd-coin",
    },
    USDT: {
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // USDT on TRON
      coingeckoId: "tether",
    },
    DAI: {
      address: "TMJWuBDvwvcm6QUWXDaC6GqTyq4ewv7Ub2", // DAI on TRON
      coingeckoId: "dai",
    },
  },
  // Add other networks as needed
}

// Mock data for testing
export const MOCK_TOKEN_BALANCES: TokenBalance[] = [
  {
    symbol: "USDC",
    balance: "1500.00",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    name: "USD Coin",
  },
  {
    symbol: "USDT",
    balance: "500.00",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    name: "Tether",
  },
  {
    symbol: "DAI",
    balance: "200.00",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    image: "https://assets.coingecko.com/coins/images/9956/large/4943.png",
    name: "Dai",
  },
]

// ABI for ERC20 tokens - minimal interface for reading balances
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
]

// Cache for token metadata
const TOKEN_METADATA_CACHE: Record<string, { image: string; name: string }> = {}

/**
 * Fetches token metadata (image, name) from CoinGecko
 */
async function getTokenMetadata(coingeckoId: string): Promise<{ image: string; name: string }> {
  // Check cache first
  if (TOKEN_METADATA_CACHE[coingeckoId]) {
    return TOKEN_METADATA_CACHE[coingeckoId]
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    const metadata = {
      image: data.image?.large || "",
      name: data.name || "",
    }

    // Cache the result
    TOKEN_METADATA_CACHE[coingeckoId] = metadata

    return metadata
  } catch (error) {
    console.error(`Error fetching token metadata for ${coingeckoId}:`, error)
    return { image: "", name: "" }
  }
}

export async function getTokenBalance(
  provider: any,
  tokenAddress: string,
  userAddress: string,
): Promise<{ balance: string; decimals: number; symbol: string; name: string }> {
  try {
    // Use dynamic import for ethers
    const { ethers } = await import("ethers")

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)

    const [balanceWei, decimals, symbol, name] = await Promise.all([
      tokenContract.balanceOf(userAddress),
      tokenContract.decimals(),
      tokenContract.symbol(),
      tokenContract.name(),
    ])

    const balance = ethers.formatUnits(balanceWei, decimals)

    return {
      balance,
      decimals,
      symbol,
      name,
    }
  } catch (error) {
    console.error("Error getting token balance:", error)
    return { balance: "0", decimals: 18, symbol: "ERROR", name: "Error" }
  }
}

export async function getDigitalUSDBalance(
  provider: any,
  userAddress: string,
  chainId = 1, // Default to Ethereum mainnet
  useMock = false,
): Promise<string> {
  if (useMock) return "1500.00"

  if (!provider || !userAddress) return "0"

  // Get the USDC address for the current chain
  const chainTokens = TOKEN_ADDRESSES[chainId]
  if (!chainTokens) return "0"

  const usdcInfo = chainTokens.USDC
  if (!usdcInfo) return "0"

  try {
    const { balance } = await getTokenBalance(provider, usdcInfo.address, userAddress)
    return balance
  } catch (error) {
    console.error("Error getting USDC balance:", error)
    return "1500.00" // Return mock data on error
  }
}

export async function getTokenBalances(
  provider: any,
  userAddress: string,
  chainId = 1,
  useMock = false,
): Promise<TokenBalance[]> {
  if (useMock) return MOCK_TOKEN_BALANCES

  if (!provider || !userAddress) return MOCK_TOKEN_BALANCES

  const chainTokens = TOKEN_ADDRESSES[chainId]
  if (!chainTokens) return MOCK_TOKEN_BALANCES

  try {
    const results: TokenBalance[] = []

    for (const [symbol, { address, coingeckoId }] of Object.entries(chainTokens)) {
      try {
        const { balance, name } = await getTokenBalance(provider, address, userAddress)

        // Get token metadata from CoinGecko
        const metadata = await getTokenMetadata(coingeckoId)

        results.push({
          symbol,
          balance,
          address,
          image: metadata.image,
          name: metadata.name || name,
        })
      } catch (error) {
        console.error(`Error getting ${symbol} balance:`, error)
        // Use mock data for this token
        const mockToken = MOCK_TOKEN_BALANCES.find((t) => t.symbol === symbol)
        if (mockToken) {
          results.push(mockToken)
        } else {
          results.push({ symbol, balance: "0", address })
        }
      }
    }

    return results.length > 0 ? results : MOCK_TOKEN_BALANCES
  } catch (error) {
    console.error("Error getting token balances:", error)
    return MOCK_TOKEN_BALANCES
  }
}

// Update getTransactionHistory to handle TRON chain
export async function getTransactionHistory(
  provider: any,
  userAddress: string,
  useMock = false,
  chainId = 1,
): Promise<Array<any>> {
  if (useMock) return MOCK_TRANSACTIONS

  if (!provider || !userAddress) return MOCK_TRANSACTIONS

  try {
    const { ethers } = await import("ethers")

    // Handle TRON chain differently
    if (chainId === 1000001) {
      // For TRON, we would need to use a TRON-specific API
      // This is a simplified mock implementation for TRON
      return [
        {
          hash: "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",
          from: userAddress,
          to: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          value: "100",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          type: "sent",
        },
        {
          hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
          from: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
          to: userAddress,
          value: "50",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          type: "received",
        },
      ]
    }

    // For EVM chains (Ethereum, BASE, etc.)
    // Get the last 10 transactions for the address
    const history = await provider.getHistory(userAddress, undefined, undefined, 10)

    // Transform the transaction data into our format
    const formattedTransactions = history.map((tx: any) => {
      const isSent = tx.from.toLowerCase() === userAddress.toLowerCase()

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "Contract Creation",
        value: ethers.formatEther(tx.value || 0),
        timestamp: new Date(Number(tx.timestamp || Date.now()) * 1000).toISOString(),
        type: isSent ? "sent" : "received",
      }
    })

    return formattedTransactions.length > 0 ? formattedTransactions : MOCK_TRANSACTIONS
  } catch (error) {
    console.error("Error getting transaction history:", error)

    // If we can't get real transaction history, return mock data
    return MOCK_TRANSACTIONS
  }
}

// Mock transaction data (fallback)
export const MOCK_TRANSACTIONS = [
  {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    value: "0.5",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    type: "sent",
  },
  {
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0xB0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    to: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    value: "1.2",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    type: "received",
  },
  {
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    to: "0xC0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    value: "0.3",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    type: "sent",
  },
]

