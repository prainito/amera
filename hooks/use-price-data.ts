"use client"

import { useState, useEffect } from "react"
import { getHistoricalPrices } from "../utils/api"

interface PriceData {
  time: number
  value: number
}

interface UsePriceDataResult {
  priceData: PriceData[] | null
  loading: boolean
  error: string | null
}

const usePriceData = (symbol: string, interval: string, limit: number): UsePriceDataResult => {
  const [priceData, setPriceData] = useState<PriceData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getHistoricalPrices(symbol, interval, limit)
        setPriceData(data)
      } catch (error: any) {
        console.error("Error fetching historical prices:", error)
        setError(error.message || "Failed to fetch historical prices")
      } finally {
        setLoading(false)
      }
    }

    fetchPriceData()
  }, [symbol, interval, limit])

  return { priceData, loading, error }
}

export default usePriceData

