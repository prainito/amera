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

interface VaultPerformanceChartProps {
  vaultAddress: string
}

const TIME_RANGES = {
  "1W": { days: 7, label: "1 Week" },
  "1M": { days: 30, label: "1 Month" },
  "3M": { days: 90, label: "3 Months" },
  "6M": { days: 180, label: "6 Months" },
  "1Y": { days: 365, label: "1 Year" },
  ALL: { days: 1825, label: "All Time" }, // 5 years as a fallback for "all time"
}

const VaultPerformanceChart: React.FC<VaultPerformanceChartProps> = ({ vaultAddress }) => {
  const [historicalPrices, setHistoricalPrices] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<string>("1M") // Use a valid default

  useEffect(() => {
    fetchHistoricalPrices(timeRange)
  }, [vaultAddress, timeRange])

  const fetchHistoricalPrices = async (timeRange: string) => {
    setIsLoading(true)
    try {
      // Add a default fallback if timeRange is invalid
      const range = TIME_RANGES[timeRange] || TIME_RANGES["1M"] // Default to 1 month if invalid
      const { days } = range

      // Mock API call - replace with actual API endpoint
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      // Generate mock data
      const mockPrices: number[] = []
      const mockLabels: string[] = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        mockLabels.push(currentDate.toLocaleDateString())
        mockPrices.push(Math.random() * 100) // Random price between 0 and 100
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setHistoricalPrices(mockPrices)
      setLabels(mockLabels)
      setError(null)
    } catch (error) {
      console.error("Error fetching historical prices:", error)
      setError("Failed to load performance data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Vault Performance",
        data: historicalPrices,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vault Performance Chart",
      },
    },
  }

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange)
  }

  if (isLoading) {
    return <div>Loading performance data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <div>
        {Object.entries(TIME_RANGES).map(([key, { label }]) => (
          <button key={key} onClick={() => handleTimeRangeChange(key)} disabled={timeRange === key}>
            {label}
          </button>
        ))}
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default VaultPerformanceChart

