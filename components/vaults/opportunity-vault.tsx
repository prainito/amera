"use client"

import { Shield, TrendingUp, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/lib/blockchain/wallet-context"

interface OpportunityVaultProps {
  onDeposit: () => void
  onWithdraw: () => void
}

export default function OpportunityVault({ onDeposit, onWithdraw }: OpportunityVaultProps) {
  const { connected } = useWallet()

  // Mock data for the vault
  const vaultData = {
    name: "Amera Opportunity Vault",
    description: "Dynamic strategy targeting higher returns through advanced yield optimization",
    apy: 15.8,
    tvl: 5200000, // $5.2M
    userDeposit: 500, // $500
    capacity: 15000000, // $15M
    utilizationRate: 34.7, // 34.7%
    lockPeriod: "None",
    riskLevel: "Higher",
    riskColor: "orange",
  }

  return (
    <Card className="overflow-hidden border-t-4 border-t-orange-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{vaultData.name}</CardTitle>
            <CardDescription className="mt-1">{vaultData.description}</CardDescription>
          </div>
          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {vaultData.riskLevel} Risk
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>APY</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{vaultData.apy}%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>Total Value</span>
            </div>
            <div className="text-2xl font-bold">${(vaultData.tvl / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>Lock Period</span>
            </div>
            <div className="text-2xl font-bold">{vaultData.lockPeriod}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Capacity</span>
              <span className="text-sm font-medium">
                ${(vaultData.tvl / 1000000).toFixed(1)}M / ${(vaultData.capacity / 1000000).toFixed(1)}M
              </span>
            </div>
            <Progress value={(vaultData.tvl / vaultData.capacity) * 100} className="h-2" />
          </div>

          {connected && vaultData.userDeposit > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Your Deposit</div>
                  <div className="text-xl font-semibold">${vaultData.userDeposit.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Earned</div>
                  <div className="text-xl font-semibold text-green-600">
                    +${((vaultData.userDeposit * vaultData.apy) / 100 / 12).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center text-sm">
            <Shield className="h-4 w-4 mr-1 text-orange-600" />
            <span>Advanced yield strategies with active management for maximized returns</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={onDeposit} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!connected}>
            Deposit
          </Button>
          <Button
            onClick={onWithdraw}
            variant="outline"
            className="flex-1"
            disabled={!connected || vaultData.userDeposit === 0}
          >
            Withdraw
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

