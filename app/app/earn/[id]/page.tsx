"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
import { Line } from "react-chartjs-2"
import moment from "moment"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const EarnDetailsPage = () => {
  const { id } = useParams()
  const [historicalPrices, setHistoricalPrices] = useState([])

  useEffect(() => {
    const fetchHistoricalPrices = async () => {
      try {
        const response = await fetch(`/api/earn/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setHistoricalPrices(data)
      } catch (error) {
        console.error("Error fetching historical prices:", error)
      }
    }

    fetchHistoricalPrices()
  }, [id])

  const chartData = {
    labels: historicalPrices.map((price) => moment(price.date).format("MMM DD")),
    datasets: [
      {
        label: "Price",
        data: historicalPrices.map((price) => price.price),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Historical Prices for ${id}`,
      },
    },
  }

  return (
    <div>
      <h1>Earn Details for {id}</h1>
      {historicalPrices.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading historical prices...</p>
      )}
    </div>
  )
}

export default EarnDetailsPage

