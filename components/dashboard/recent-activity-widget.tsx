"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, ArrowDownRight, Clock, TrendingUp } from "lucide-react"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "deposit" | "withdraw" | "interest" | "transfer"
  amount: number
  timestamp: Date
  description: string
  status: "completed" | "pending" | "failed"
}

export function RecentActivityWidget() {
  const { connected, address } = useWallet()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Mock data - in production this would come from your API
      if (connected && address) {
        setActivities([
          {
            id: "act1",
            type: "deposit",
            amount: 500,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            description: "Deposit to Amera Growth Vault",
            status: "completed",
          },
          {
            id: "act2",
            type: "interest",
            amount: 2.15,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            description: "Interest from Amera Safe Vault",
            status: "completed",
          },
          {
            id: "act3",
            type: "withdraw",
            amount: 250,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            description: "Withdrawal from Amera Safe Vault",
            status: "completed",
          },
          {
            id: "act4",
            type: "deposit",
            amount: 1000,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            description: "Deposit to Amera Safe Vault",
            status: "completed",
          },
        ])
      } else {
        setActivities([])
      }

      setIsLoading(false)
    }

    fetchActivities()
  }, [connected, address])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "interest":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "transfer":
        return <ArrowRight className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your transaction history</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">Connect your wallet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Connect your wallet to view your transaction history</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your transaction history</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">No recent activity</h3>
            <p className="text-sm text-gray-500 mt-1">Your transactions will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your transaction history</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{activity.description}</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </div>
              </div>
              <div
                className={`font-medium ${
                  activity.type === "withdraw"
                    ? "text-red-600"
                    : activity.type === "deposit"
                      ? "text-green-600"
                      : activity.type === "interest"
                        ? "text-blue-600"
                        : ""
                }`}
              >
                {activity.type === "withdraw"
                  ? "-"
                  : activity.type === "deposit" || activity.type === "interest"
                    ? "+"
                    : ""}
                ${activity.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" className="w-full justify-between">
          View All Transactions <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

