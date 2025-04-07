"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useWallet } from "@/lib/blockchain/wallet-context"
import {
  getMarketData,
  formatPrice,
  formatPercentage,
  getPercentageColorClass,
  type CoinMarketData,
} from "@/lib/services/coingecko-service"
import TokenSwap from "@/components/blockchain/token-swap"

export default function Trade() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  const { connected, isMockWallet } = useWallet()
  const [allCoins, setAllCoins] = useState<CoinMarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("market") // "market" or "swap"
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true)
      try {
        const data = await getMarketData()
        setAllCoins(data)
      } catch (error) {
        console.error("Error fetching coin data:", error)
        // Use mock data as fallback
        setAllCoins([
          {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            current_price: 100000,
            price_change_percentage_24h: 1.5,
            market_cap: 1000000000000,
            total_volume: 50000000000,
          },
          {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
            current_price: 3500,
            price_change_percentage_24h: 4.5,
            market_cap: 500000000000,
            total_volume: 25000000000,
          },
          {
            id: "ripple",
            symbol: "xrp",
            name: "XRP",
            image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
            current_price: 0.75,
            price_change_percentage_24h: -2.1,
            market_cap: 40000000000,
            total_volume: 2000000000,
          },
          {
            id: "solana",
            symbol: "sol",
            name: "Solana",
            image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
            current_price: 150,
            price_change_percentage_24h: 15,
            market_cap: 60000000000,
            total_volume: 5000000000,
          },
          {
            id: "cardano",
            symbol: "ada",
            name: "Cardano",
            image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
            current_price: 0.65,
            price_change_percentage_24h: 8.3,
            market_cap: 25000000000,
            total_volume: 1500000000,
          },
          {
            id: "polkadot",
            symbol: "dot",
            name: "Polkadot",
            image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
            current_price: 12.5,
            price_change_percentage_24h: 7.2,
            market_cap: 15000000000,
            total_volume: 1000000000,
          },
          {
            id: "dogecoin",
            symbol: "doge",
            name: "Dogecoin",
            image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
            current_price: 0.08,
            price_change_percentage_24h: -5.4,
            market_cap: 12000000000,
            total_volume: 800000000,
          },
          {
            id: "shiba-inu",
            symbol: "shib",
            name: "Shiba Inu",
            image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
            current_price: 0.000012,
            price_change_percentage_24h: -4.8,
            market_cap: 8000000000,
            total_volume: 500000000,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCoinData()
  }, [])

  // Handle switching to swap tab with selected coin
  const handleSwapCoin = (coin: CoinMarketData) => {
    // First set the selected coin
    setSelectedCoin(coin)
    // Then switch to the swap tab
    setActiveTab("swap")
  }

  // Filter coins based on search query
  const filteredCoins = allCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get popular coins (top 4 by market cap)
  const popularCoins = allCoins.slice(0, 4)

  // Get top gainers (top 3 by 24h percentage change)
  const topGainers = [...allCoins]
    .filter((coin) => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3)

  // Get top losers (bottom 3 by 24h percentage change)
  const topLosers = [...allCoins]
    .filter((coin) => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 3)

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trade</h1>
        {isMockWallet && <p className="text-blue-500 mt-2">Using mock wallet data for demonstration purposes.</p>}
      </div>

      {/* Tabs for Market and Swap */}
      <Tabs value={activeTab} className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for coins"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Coins */}
          {!searchQuery && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Popular Coins</h2>
                <Button variant="link" className="text-blue-600 p-0">
                  See all
                </Button>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-center mb-2">
                          <Skeleton className="h-5 w-12" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {popularCoins.map((coin) => (
                    <Card key={coin.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium flex items-center">
                            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-5 h-5 mr-2" />
                            {coin.symbol.toUpperCase()}
                          </div>
                          <div className={getPercentageColorClass(coin.price_change_percentage_24h)}>
                            {formatPercentage(coin.price_change_percentage_24h)}
                          </div>
                        </div>
                        <div className="text-lg font-semibold">{formatPrice(coin.current_price)}</div>
                        <div className="text-sm text-gray-500">{coin.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Top Gainers & Losers */}
          {!searchQuery && (
            <div className="mb-8">
              <Tabs defaultValue="gainers">
                <TabsList className="mb-4">
                  <TabsTrigger value="gainers" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Top Gainers
                  </TabsTrigger>
                  <TabsTrigger value="losers" className="flex items-center">
                    <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                    Top Losers
                  </TabsTrigger>
                </TabsList>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="space-y-2 text-right">
                              <Skeleton className="h-5 w-20" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    <TabsContent value="gainers">
                      <div className="space-y-4">
                        {topGainers.map((coin) => (
                          <Card key={coin.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium flex items-center">
                                    <img
                                      src={coin.image || "/placeholder.svg"}
                                      alt={coin.name}
                                      className="w-5 h-5 mr-2"
                                    />
                                    {coin.name}
                                  </div>
                                  <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                                </div>
                                <div>
                                  <div className="text-right font-semibold">{formatPrice(coin.current_price)}</div>
                                  <div
                                    className={`text-right ${getPercentageColorClass(coin.price_change_percentage_24h)}`}
                                  >
                                    {formatPercentage(coin.price_change_percentage_24h)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="losers">
                      <div className="space-y-4">
                        {topLosers.map((coin) => (
                          <Card key={coin.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium flex items-center">
                                    <img
                                      src={coin.image || "/placeholder.svg"}
                                      alt={coin.name}
                                      className="w-5 h-5 mr-2"
                                    />
                                    {coin.name}
                                  </div>
                                  <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                                </div>
                                <div>
                                  <div className="text-right font-semibold">{formatPrice(coin.current_price)}</div>
                                  <div
                                    className={`text-right ${getPercentageColorClass(coin.price_change_percentage_24h)}`}
                                  >
                                    {formatPercentage(coin.price_change_percentage_24h)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          )}

          {/* All Coins / Search Results */}
          <div>
            <h2 className="text-lg font-semibold mb-4">{searchQuery ? "Search Results" : "All Coins"}</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4 space-y-2 text-right">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCoins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No coins found matching "{searchQuery}"</div>
            ) : (
              <div className="space-y-4">
                {filteredCoins.map((coin) => (
                  <Card key={coin.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium flex items-center">
                            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-5 h-5 mr-2" />
                            {coin.name}
                          </div>
                          <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <div className="text-right font-semibold">{formatPrice(coin.current_price)}</div>
                            <div className={`text-right ${getPercentageColorClass(coin.price_change_percentage_24h)}`}>
                              {formatPercentage(coin.price_change_percentage_24h)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={!connected}
                            onClick={() => handleSwapCoin(coin)}
                          >
                            <span className="mr-1">Trade</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="swap">
          <div className="mb-8">
            <TokenSwap selectedCoin={selectedCoin} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

