"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getMarketData, formatPrice, getPercentageColorClass } from "@/lib/coingecko-service"
import type { CoinMarketData } from "@/types"

export function MarketOverviewWidget() {
  const [marketData, setMarketData] = useState<CoinMarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get real data from CoinGecko API
        // Focus on stablecoins and major cryptocurrencies
        const coinIds = ["usd-coin", "tether", "dai", "ethereum", "bitcoin"]
        const data = await getMarketData(coinIds)

        if (data && data.length > 0) {
          setMarketData(data)
        } else {
          setError("No market data available")
        }
      } catch (err) {
        console.error("Error fetching market data:", err)
        setError("Failed to load market data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchMarketData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Latest prices and market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Latest prices and market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 text-sm text-primary hover:underline">
              Refresh
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Latest prices and market data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((asset) => (
            <div key={asset.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-gray-500">{asset.symbol.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(asset.current_price)}</div>
                <div
                  className={`text-sm flex items-center ${getPercentageColorClass(asset.price_change_percentage_24h)}`}
                >
                  {asset.price_change_percentage_24h >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

