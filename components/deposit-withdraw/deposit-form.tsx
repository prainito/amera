"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { useBanxaOnramp } from "@/hooks/use-banxa-onramp"

export function DepositForm() {
  const { connected } = useWallet()
  const { openBanxaOnramp } = useBanxaOnramp()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    if (!connected) return

    setIsLoading(true)

    try {
      // Open Banxa onramp with "buy" direction
      openBanxaOnramp({
        fiatAmount: Number.parseFloat(amount),
        fiatCurrency: currency,
        direction: "buy",
      })
    } catch (error) {
      console.error("Error opening Banxa:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="apple">Apple Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              Deposits are processed through our secure payment partner. Funds typically arrive within minutes for card
              payments and 1-3 business days for bank transfers.
            </p>
          </div>

          <Button className="w-full" disabled={!connected || !amount || isLoading} onClick={handleDeposit}>
            {isLoading ? "Processing..." : !connected ? "Connect Wallet" : "Deposit Funds"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

