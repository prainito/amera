"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PriceChartProps {
  symbol: string
}

const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState<{ date: string; close: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistoricalPrices = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY
        if (!apiKey) {
          throw new Error(
            "Polygon API key is missing. Please set the NEXT_PUBLIC_POLYGON_API_KEY environment variable.",
          )
        }
        const today = new Date()
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

        const to = today.toISOString().split("T")[0]
        const from = oneYearAgo.toISOString().split("T")[0]

        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.results) {
          const formattedData = data.results.map((item: any) => ({
            date: new Date(item.t).toLocaleDateString(),
            close: item.c,
          }))
          setHistoricalData(formattedData)
        } else {
          setHistoricalData([])
        }
      } catch (error: any) {
        console.error("Error fetching historical prices:", error)
        setError(error.message || "An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalPrices()
  }, [symbol])

  const chartData = {
    labels: historicalData.map((data) => data.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: historicalData.map((data) => data.close),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${symbol} Price Chart`,
      },
    },
  }

  if (loading) {
    return <div>Loading price chart...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return <Line data={chartData} options={options} />
}

export default PriceChart

