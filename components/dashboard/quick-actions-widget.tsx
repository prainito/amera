"use client"

import { useState } from "react"
import { ArrowUpDown, Send, Wallet, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReferralQRModal } from "@/components/referral/referral-qr-modal"

export function QuickActionsWidget() {
  const [referralModalOpen, setReferralModalOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 text-left space-y-2"
              href="/app/deposit-withdraw"
            >
              <Wallet className="h-6 w-6" />
              <div>
                <div className="font-medium">Deposit</div>
                <div className="text-xs text-muted-foreground">Add funds to your account</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 text-left space-y-2"
              href="/app/deposit-withdraw?tab=withdraw"
            >
              <ArrowUpDown className="h-6 w-6" />
              <div>
                <div className="font-medium">Withdraw</div>
                <div className="text-xs text-muted-foreground">Withdraw funds to your bank</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 text-left space-y-2"
              href="/app/send"
            >
              <Send className="h-6 w-6" />
              <div>
                <div className="font-medium">Send</div>
                <div className="text-xs text-muted-foreground">Transfer to another account</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 text-left space-y-2"
              href="/app/trade"
            >
              <ArrowUpDown className="h-6 w-6 rotate-90" />
              <div>
                <div className="font-medium">OTC Trading</div>
                <div className="text-xs text-muted-foreground">Large volume transactions</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 text-left space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800"
              onClick={() => setReferralModalOpen(true)}
            >
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium text-blue-700 dark:text-blue-300">Refer</div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Earn rewards together</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 text-left space-y-2"
              href="/app/earn"
            >
              <Wallet className="h-6 w-6" />
              <div>
                <div className="font-medium">Vaults</div>
                <div className="text-xs text-muted-foreground">Earn interest on your funds</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReferralQRModal open={referralModalOpen} onOpenChange={setReferralModalOpen} />
    </>
  )
}

