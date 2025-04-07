"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { Progress } from "@/components/ui/progress"

interface ReferralStats {
  totalReferred: number
  activeReferrals: number
  totalEarned: number
  pendingRewards: number
  monthlyGoal: number
  monthlyProgress: number
}

export function ReferralRewardsWidget() {
  const router = useRouter()
  const { connected } = useWallet()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReferralStats = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Mock data - in production this would come from your API
      if (connected) {
        setStats({
          totalReferred: 12,
          activeReferrals: 8,
          totalEarned: 250,
          pendingRewards: 45,
          monthlyGoal: 5,
          monthlyProgress: 3,
        })
      } else {
        setStats(null)
      }

      setIsLoading(false)
    }

    fetchReferralStats()
  }, [connected])

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Rewards</CardTitle>
          <CardDescription>Earn by inviting friends to Amera</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Gift className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">Connect your wallet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Connect your wallet to view your referral rewards</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Rewards</CardTitle>
          <CardDescription>Earn by inviting friends to Amera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Rewards</CardTitle>
          <CardDescription>Earn by inviting friends to Amera</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Gift className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">No referrals yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Start earning by inviting friends to Amera</p>
            <Button onClick={() => router.push("/app/rewards")}>Start Referring</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Rewards</CardTitle>
        <CardDescription>Earn by inviting friends to Amera</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">Friends Referred</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalReferred}</p>
            <p className="text-xs text-gray-500">{stats.activeReferrals} active users</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Total Earned</span>
            </div>
            <p className="text-2xl font-bold">${stats.totalEarned}</p>
            <p className="text-xs text-gray-500">${stats.pendingRewards} pending</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Monthly Referral Goal</span>
            <span className="text-sm text-gray-500">
              {stats.monthlyProgress} of {stats.monthlyGoal} referrals
            </span>
          </div>
          <Progress value={(stats.monthlyProgress / stats.monthlyGoal) * 100} className="h-2" />
          <p className="text-xs text-gray-500">
            Refer {stats.monthlyGoal - stats.monthlyProgress} more friends this month to earn a $50 bonus!
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" className="w-full justify-between" onClick={() => router.push("/app/rewards")}>
          View Rewards Program <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

