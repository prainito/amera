"use client"

import { useEffect, useState } from "react"
import { ArrowRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useWallet } from "@/lib/blockchain/wallet-context"

interface VaultSummary {
  id: string
  name: string
  apy: number
  deposited: number
  earned: number
  color: string
}

export function YourVaultsWidget() {
  const router = useRouter()
  const { connected, address } = useWallet()
  const [vaults, setVaults] = useState<VaultSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchUserVaults = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data - in production this would come from your API
      if (connected && address) {
        setVaults([
          {
            id: "safe",
            name: "Amera Safe Vault",
            apy: 5.2,
            deposited: 1000,
            earned: 4.33,
            color: "green",
          },
          {
            id: "growth",
            name: "Amera Growth Vault",
            apy: 10.2,
            deposited: 750,
            earned: 6.38,
            color: "yellow",
          },
        ])
      } else {
        setVaults([])
      }

      setIsLoading(false)
    }

    fetchUserVaults()
  }, [connected, address])

  const totalDeposited = vaults.reduce((sum, vault) => sum + vault.deposited, 0)
  const totalEarned = vaults.reduce((sum, vault) => sum + vault.earned, 0)

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Vaults</CardTitle>
          <CardDescription>Earn interest on your digital USD</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <TrendingUp className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">Connect your wallet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Connect your wallet to view your vault investments</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Vaults</CardTitle>
          <CardDescription>Earn interest on your digital USD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (vaults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Vaults</CardTitle>
          <CardDescription>Earn interest on your digital USD</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <TrendingUp className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">No active investments</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Start earning interest by depositing into a vault</p>
            <Button onClick={() => router.push("/app/vaults")}>Explore Vaults</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Vaults</CardTitle>
        <CardDescription>Earn interest on your digital USD</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div>
              <div className="text-sm text-gray-500">Total Deposited</div>
              <div className="text-2xl font-semibold">${totalDeposited.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Earned</div>
              <div className="text-2xl font-semibold text-green-600">+${totalEarned.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {vaults.map((vault) => (
            <div key={vault.id} className={`p-4 rounded-lg border-l-4 border-${vault.color}-500 bg-gray-50`}>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{vault.name}</div>
                <div className="text-green-600 font-medium">{vault.apy}% APY</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Deposited:</span> ${vault.deposited}
                </div>
                <div className="text-green-600">+${vault.earned.toFixed(2)} earned</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" className="w-full justify-between" onClick={() => router.push("/app/vaults")}>
          View All Vaults <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

