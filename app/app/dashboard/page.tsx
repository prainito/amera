"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { YourVaultsWidget } from "@/components/dashboard/your-vaults-widget"
import { MarketOverviewWidget } from "@/components/dashboard/market-overview-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"
import { QuickActionsWidget } from "@/components/dashboard/quick-actions-widget"
import { ReferralRewardsWidget } from "@/components/dashboard/referral-rewards-widget"
import { useWallet } from "@/lib/blockchain/wallet-context"

export default function DashboardPage() {
  const { connected, address } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data - in production this would come from your API
      if (connected && address) {
        setBalance(2750.45)
      } else {
        setBalance(null)
      }

      setIsLoading(false)
    }

    fetchBalance()
  }, [connected, address])

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader>
          <CardTitle className="text-white/80 text-sm font-normal">Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-10 w-32 bg-white/20 rounded"></div>
          ) : balance !== null ? (
            <div className="text-4xl font-bold">${balance.toLocaleString()}</div>
          ) : (
            <div className="text-xl">Connect your wallet to view balance</div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <QuickActionsWidget />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <YourVaultsWidget />
          <MarketOverviewWidget />
        </div>
        <div className="space-y-6">
          <RecentActivityWidget />
          <ReferralRewardsWidget />
        </div>
      </div>
    </div>
  )
}

