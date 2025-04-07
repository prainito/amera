"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  formatPrice,
  formatPercentage,
  getPercentageColorClass,
  getMarketData,
  type CoinMarketData,
} from "@/lib/services/coingecko-service"

// Define popular coin IDs
const POPULAR_COIN_IDS = ["bitcoin", "ethereum", "binancecoin", "ripple", "cardano", "solana", "polkadot", "dogecoin"]

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<CoinMarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"gainers" | "losers">("gainers")

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true)
      try {
        // Fetch top 100 coins by market cap
        const data = await getMarketData([], "usd", 100)
        setMarketData(data)
      } catch (error) {
        console.error("Error fetching market data:", error)
        // Use mock data as fallback
        setMarketData([
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
          // ... add more mock data
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    // Refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Get popular coins
  const popularCoins = marketData.filter((coin) => POPULAR_COIN_IDS.includes(coin.id)).slice(0, 4)

  // Get gainers and losers
  const gainers = [...marketData]
    .filter((coin) => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5)

  const losers = [...marketData]
    .filter((coin) => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5)

  const renderCoinCard = (coin: CoinMarketData) => (
    <Card key={coin.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
            <div className="font-medium">{coin.symbol.toUpperCase()}</div>
          </div>
          <div className={getPercentageColorClass(coin.price_change_percentage_24h)}>
            {formatPercentage(coin.price_change_percentage_24h)}
          </div>
        </div>
        <div className="text-lg font-semibold">{formatPrice(coin.current_price)}</div>
        <div className="text-sm text-gray-500">{coin.name}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Popular Coins */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Popular Coins</h2>
          <Button variant="link" className="text-blue-600 p-0">
            See all
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{popularCoins.map(renderCoinCard)}</div>
        )}
      </div>

      {/* Gainers & Losers */}
      <div>
        <Tabs defaultValue="gainers" onValueChange={(value) => setActiveTab(value as "gainers" | "losers")}>
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
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
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
                  {gainers.map((coin) => (
                    <Card key={coin.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium flex items-center">
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-5 h-5 mr-2" />
                              {coin.name}
                            </div>
                            <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                          </div>
                          <div>
                            <div className="text-right font-semibold">{formatPrice(coin.current_price)}</div>
                            <div className={`text-right ${getPercentageColorClass(coin.price_change_percentage_24h)}`}>
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
                  {losers.map((coin) => (
                    <Card key={coin.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium flex items-center">
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-5 h-5 mr-2" />
                              {coin.name}
                            </div>
                            <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                          </div>
                          <div>
                            <div className="text-right font-semibold">{formatPrice(coin.current_price)}</div>
                            <div className={`text-right ${getPercentageColorClass(coin.price_change_percentage_24h)}`}>
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
    </div>
  )
}

