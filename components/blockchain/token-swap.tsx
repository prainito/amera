"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowDown, RefreshCw, Settings, Info, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getTokensForChain, type TokenInfo } from "@/lib/blockchain/swap-service"
import type { CoinMarketData } from "@/types"
import PriceChart from "./price-chart"
import { getTop500Tokens, searchTokens } from "@/lib/services/coingecko-service"

const POPULAR_TOKENS = ["USDC", "USDT", "ETH", "BTC", "SOL", "MATIC", "DOGE", "SHIB"]

interface TokenSwapProps {
  selectedCoin?: CoinMarketData | null
}

export default function TokenSwap({ selectedCoin }: TokenSwapProps) {
  const { connected, chainId, address, provider, isMockWallet } = useWallet()
  const [loading, setLoading] = useState(true)
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([])
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null)
  const [toToken, setToToken] = useState<TokenInfo | null>(null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [exchangeRate, setExchangeRate] = useState<string | null>(null)
  const [swapping, setSwapping] = useState(false)
  const [slippage, setSlippage] = useState(0.5) // Default slippage tolerance: 0.5%
  const [priceImpact, setPriceImpact] = useState<string | null>(null)

  // Token selection state
  const [isSelectingFromToken, setIsSelectingFromToken] = useState(false)
  const [isSelectingToToken, setIsSelectingToToken] = useState(false)
  const [tokenSearchQuery, setTokenSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<TokenInfo[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load available tokens for the current chain
  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true)
      try {
        const tokens = await getTokensForChain(chainId || 1)
        setAvailableTokens(tokens)
        setSearchResults(tokens)

        // If we have a selected coin, set it as the "to" token
        if (selectedCoin) {
          const selectedToken = tokens.find((t) => t.symbol.toLowerCase() === selectedCoin.symbol.toLowerCase())
          if (selectedToken) {
            setToToken(selectedToken)
            // Set USDC or USDT as the "from" token by default
            const stablecoin = tokens.find((t) => t.symbol === "USDC" || t.symbol === "USDT")
            if (stablecoin) {
              setFromToken(stablecoin)
            }
          }
        } else if (tokens.length >= 2) {
          // Default behavior when no coin is selected
          setFromToken(tokens[0])
          setToToken(tokens[1])
        }
      } catch (error) {
        console.error("Error loading tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTokens()
  }, [chainId, selectedCoin])

  // Calculate exchange rate when tokens or amounts change
  useEffect(() => {
    const calculateExchangeRate = async () => {
      if (!fromToken || !toToken || !fromAmount || Number.parseFloat(fromAmount) === 0) {
        setExchangeRate(null)
        setToAmount("")
        setPriceImpact(null)
        return
      }

      try {
        // In a real implementation, we would call Uniswap's API here
        // For now, we'll use a mock calculation
        const mockRate = fromToken.price / toToken.price
        const calculatedAmount = Number.parseFloat(fromAmount) * mockRate

        setToAmount(calculatedAmount.toFixed(6))
        setExchangeRate(`1 ${fromToken.symbol} = ${mockRate.toFixed(6)} ${toToken.symbol}`)

        // Mock price impact calculation
        setPriceImpact((Math.random() * 0.5).toFixed(2) + "%")
      } catch (error) {
        console.error("Error calculating exchange rate:", error)
      }
    }

    calculateExchangeRate()
  }, [fromToken, toToken, fromAmount])

  // Focus search input when token selection modal opens
  useEffect(() => {
    if ((isSelectingFromToken || isSelectingToToken) && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSelectingFromToken, isSelectingToToken])

  // Search for tokens
  useEffect(() => {
    const searchTokensEffect = async () => {
      if (!tokenSearchQuery.trim()) {
        // Load top tokens when no search query
        try {
          const topTokens = await getTop500Tokens()
          setSearchResults(topTokens.slice(0, 20)) // Show first 20 by default
        } catch (error) {
          console.error("Error loading top tokens:", error)
          setSearchResults([])
        }
        return
      }

      setIsSearching(true)
      try {
        const results = await searchTokens(tokenSearchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error("Error searching tokens:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchTokensEffect, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [tokenSearchQuery])

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    if (!connected || !fromToken || !toToken || !fromAmount || !toAmount) return

    setSwapping(true)
    try {
      // In a real implementation, we would call Uniswap's SDK here
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form after successful swap
      setFromAmount("")
      setToAmount("")

      // Show success message or notification
      alert(`Successfully swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`)
    } catch (error) {
      console.error("Error performing swap:", error)
      alert("Failed to complete swap. Please try again.")
    } finally {
      setSwapping(false)
    }
  }

  const getMaxAmount = async () => {
    if (!fromToken) return

    // In a real implementation, we would get the user's balance
    // For now, we'll use a mock value
    const mockBalance = 1000
    setFromAmount(mockBalance.toString())
  }

  const selectToken = (token: TokenInfo) => {
    if (isSelectingFromToken) {
      setFromToken(token)
      setIsSelectingFromToken(false)
    } else if (isSelectingToToken) {
      setToToken(token)
      setIsSelectingToToken(false)
    }
    setTokenSearchQuery("")
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-4">Connect your wallet to swap tokens</p>
          <p className="text-sm text-gray-400">Swap tokens across Ethereum, BASE, and TRON chains</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PriceChart tokenId={toToken?.id || null} symbol={toToken?.symbol || ""} />
      {/* Existing swap interface */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Swap Tokens</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="p-2 w-48">
                  <p className="text-sm font-medium mb-2">Slippage Tolerance</p>
                  <div className="flex gap-2 flex-wrap">
                    {[0.1, 0.5, 1.0].map((value) => (
                      <Button
                        key={value}
                        variant={slippage === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSlippage(value)}
                      >
                        {value}%
                      </Button>
                    ))}
                    <Input
                      type="number"
                      value={slippage}
                      onChange={(e) => setSlippage(Number.parseFloat(e.target.value))}
                      className="w-16 h-9"
                      min="0.1"
                      max="20"
                      step="0.1"
                    />
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* From Token */}
              <div className="rounded-lg border p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">From</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800" onClick={getMaxAmount}>
                    Max
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSelectingFromToken(true)}
                    className="flex items-center min-w-[120px] h-10 px-3 py-2 border rounded-md hover:bg-gray-50"
                  >
                    {fromToken ? (
                      <>
                        <img
                          src={fromToken.logoURI || "/placeholder.svg?height=20&width=20"}
                          alt={fromToken.symbol}
                          className="w-5 h-5 mr-2 rounded-full"
                        />
                        <span>{fromToken.symbol}</span>
                      </>
                    ) : (
                      "Select Token"
                    )}
                  </button>
                  <Input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.0"
                    className="text-lg border-none shadow-none focus-visible:ring-0 flex-1"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-100" onClick={handleSwapTokens}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="rounded-lg border p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">To</span>
                  <span className="text-sm text-gray-500">{exchangeRate && `≈ ${toAmount}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSelectingToToken(true)}
                    className="flex items-center min-w-[120px] h-10 px-3 py-2 border rounded-md hover:bg-gray-50"
                  >
                    {toToken ? (
                      <>
                        <img
                          src={toToken.logoURI || "/placeholder.svg?height=20&width=20"}
                          alt={toToken.symbol}
                          className="w-5 h-5 mr-2 rounded-full"
                        />
                        <span>{toToken.symbol}</span>
                      </>
                    ) : (
                      "Select Token"
                    )}
                  </button>
                  <Input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0.0"
                    className="text-lg border-none shadow-none focus-visible:ring-0 flex-1"
                    readOnly
                  />
                </div>
              </div>

              {/* Exchange Rate */}
              {exchangeRate && (
                <div className="flex justify-between items-center text-sm text-gray-500 px-2">
                  <div>Exchange Rate</div>
                  <div>{exchangeRate}</div>
                </div>
              )}

              {/* Price Impact */}
              {priceImpact && (
                <div className="flex justify-between items-center text-sm text-gray-500 px-2">
                  <div className="flex items-center">
                    <span>Price Impact</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            The difference between the market price and estimated price due to trade size.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div>{priceImpact}</div>
                </div>
              )}

              {/* Swap Button */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                disabled={!fromToken || !toToken || !fromAmount || !toAmount || swapping}
                onClick={handleSwap}
              >
                {swapping ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Swap"
                )}
              </Button>

              {/* Chain Info */}
              <div className="text-center text-xs text-gray-500 mt-2">
                Swapping on {chainId === 1 ? "Ethereum" : chainId === 8453 ? "BASE" : "TRON"} chain via Uniswap
              </div>
            </div>
          )}

          {/* Token Selection Modal */}
          {(isSelectingFromToken || isSelectingToToken) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
              <div className="bg-white rounded-lg w-full max-w-md p-3 sm:p-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Select a token</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSelectingFromToken(false)
                      setIsSelectingToToken(false)
                      setTokenSearchQuery("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search name or paste address"
                    className="pl-10"
                    value={tokenSearchQuery}
                    onChange={(e) => setTokenSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {POPULAR_TOKENS.map((symbol) => (
                    <Button
                      key={symbol}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const token = availableTokens.find((t) => t.symbol === symbol)
                        if (token) selectToken(token)
                      }}
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>

                <div className="overflow-y-auto flex-1">
                  {isSearching ? (
                    <div className="flex justify-center items-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {tokenSearchQuery ? "No tokens found" : "Start typing to search tokens"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map((token) => (
                        <button
                          key={token.address}
                          className="w-full flex items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => selectToken(token)}
                        >
                          <img
                            src={token.logoURI || "/placeholder.svg?height=32&width=32"}
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-sm text-gray-500">{token.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

