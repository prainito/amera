"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWallet } from "@/lib/blockchain/wallet-context"
import VaultDepositModal from "@/components/vaults/vault-deposit-modal"
import VaultWithdrawModal from "@/components/vaults/vault-withdraw-modal"
import SafeVault from "@/components/vaults/safe-vault"
import GrowthVault from "@/components/vaults/growth-vault"
import OpportunityVault from "@/components/vaults/opportunity-vault"

export default function EarnPage() {
  const { connected } = useWallet()
  const [activeTab, setActiveTab] = useState("all")
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [selectedVault, setSelectedVault] = useState<string | null>(null)

  const handleDeposit = (vaultId: string) => {
    setSelectedVault(vaultId)
    setDepositModalOpen(true)
  }

  const handleWithdraw = (vaultId: string) => {
    setSelectedVault(vaultId)
    setWithdrawModalOpen(true)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earn Interest</h1>
        <p className="text-gray-500 mt-2">
          Deposit your Digital USD into our managed vaults to earn interest with different risk-reward profiles
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Options</TabsTrigger>
          <TabsTrigger value="low">Low Risk</TabsTrigger>
          <TabsTrigger value="medium">Medium Risk</TabsTrigger>
          <TabsTrigger value="high">Higher Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          <SafeVault onDeposit={() => handleDeposit("safe")} onWithdraw={() => handleWithdraw("safe")} />
          <GrowthVault onDeposit={() => handleDeposit("growth")} onWithdraw={() => handleWithdraw("growth")} />
          <OpportunityVault
            onDeposit={() => handleDeposit("opportunity")}
            onWithdraw={() => handleWithdraw("opportunity")}
          />
        </TabsContent>

        <TabsContent value="low" className="mt-4 space-y-4">
          <SafeVault onDeposit={() => handleDeposit("safe")} onWithdraw={() => handleWithdraw("safe")} />
        </TabsContent>

        <TabsContent value="medium" className="mt-4 space-y-4">
          <GrowthVault onDeposit={() => handleDeposit("growth")} onWithdraw={() => handleWithdraw("growth")} />
        </TabsContent>

        <TabsContent value="high" className="mt-4 space-y-4">
          <OpportunityVault
            onDeposit={() => handleDeposit("opportunity")}
            onWithdraw={() => handleWithdraw("opportunity")}
          />
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            Understanding Risk Levels
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Risk levels are determined based on the strategies used to generate interest.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Low Risk</h3>
              <p className="text-sm text-gray-600">
                Conservative strategies focused on capital preservation with steady, reliable returns.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Medium Risk</h3>
              <p className="text-sm text-gray-600">
                Balanced approach with moderate volatility aimed at consistent growth over time.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Higher Risk</h3>
              <p className="text-sm text-gray-600">
                Dynamic strategies targeting higher returns with increased volatility and risk exposure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">How do I earn interest?</h3>
            <p className="text-gray-600">
              Simply deposit your Digital USD into one of our interest-earning options. Each option has a different
              risk-reward profile.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">How is interest generated?</h3>
            <p className="text-gray-600">
              Interest is generated through a combination of lending, yield farming, and other financial strategies
              managed by our expert team.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Can I withdraw anytime?</h3>
            <p className="text-gray-600">
              Yes, you can withdraw your funds at any time, though some options may have a small withdrawal fee.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Are there any fees?</h3>
            <p className="text-gray-600">
              Each earning option has different fee structures. Typically, there's a small performance fee on profits.
              All fees are transparently displayed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <VaultDepositModal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} vaultId={selectedVault} />
      <VaultWithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        vaultId={selectedVault}
      />
    </div>
  )
}

