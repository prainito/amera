"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Dynamically import recharts components to avoid SSR issues
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })

// Or if it's only using the individual functions:
import { getHistoricalPrices, type TimeRange, type PricePoint } from "@/lib/services/coingecko-service"

interface PriceChartProps {
  tokenId: string | null
  symbol: string
}

const TIME_RANGES = [
  { label: "1H", value: "1" },
  { label: "24H", value: "24" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "1Y", value: "365" },
] as const

export default function PriceChart({ tokenId, symbol }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<string>("24")
  const [priceData, setPriceData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPriceData = async () => {
      if (!tokenId) {
        setPriceData([])
        return
      }

      setLoading(true)
      try {
        const response = await getHistoricalPrices(tokenId, timeRange as TimeRange)

        // Transform the data for the chart
        const chartData = response.map((item: PricePoint) => ({
          time: new Date(item.timestamp).toLocaleString(),
          price: item.price,
        }))

        setPriceData(chartData)
      } catch (error) {
        console.error("Error fetching price data:", error)
        setPriceData([])
      } finally {
        setLoading(false)
      }
    }

    fetchPriceData()
  }, [tokenId, timeRange])

  if (!tokenId) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Select a token to view price chart</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{symbol} Price Chart</h3>
        <div className="flex gap-2">
          {TIME_RANGES.map(({ label, value }) => (
            <Button
              key={value}
              variant={timeRange === value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : priceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line type="monotone" dataKey="price" stroke="#2563eb" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No price data available</div>
        )}
      </div>
    </Card>
  )
}

