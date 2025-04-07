"use client"

import type React from "react"

import { useState } from "react"
import { X, DollarSign, Bitcoin, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/lib/blockchain/wallet-context"

interface BanxaOnrampModalProps {
  isOpen: boolean
  onClose: () => void
  fiatAmount?: number
  fiatCurrency?: string
  cryptoCurrency?: string
  direction?: "buy" | "sell"
}

export function BanxaOnrampModal({
  isOpen,
  onClose,
  fiatAmount,
  fiatCurrency,
  cryptoCurrency,
  direction = "buy",
}: BanxaOnrampModalProps) {
  const { connected, address } = useWallet()
  const [amount, setAmount] = useState<string>(fiatAmount ? fiatAmount.toString() : "100")
  const [sourceCurrency, setSourceCurrency] = useState<string>(fiatCurrency || "USD")
  const [targetCurrency, setTargetCurrency] = useState<string>(cryptoCurrency || "USDC")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !address) {
      alert("Please connect your wallet first")
      return
    }

    setLoading(true)

    try {
      // Construct Banxa URL
      const banxaUrl = `https://banxa.com/checkout/`

      // Redirect to Banxa checkout
      window.location.href = banxaUrl
    } catch (error) {
      console.error("Error creating Banxa order:", error)
      alert("There was an error processing your request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">Buy or Sell Crypto</h2>
          <p className="text-gray-500 mb-6">Securely buy or sell cryptocurrency with your preferred payment method</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label>I want to</Label>
                <RadioGroup value={direction} onValueChange={(value) => {}} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy" className="cursor-pointer">
                      Buy Crypto
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="cursor-pointer">
                      Sell Crypto
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="flex flex-col sm:flex-row mt-1 gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      min="50"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Select value={sourceCurrency} onValueChange={(value) => {}}>
                    <SelectTrigger className="w-full sm:w-[100px] sm:ml-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center py-2">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              <div>
                <Label>You'll receive</Label>
                <div className="flex flex-col sm:flex-row mt-1 gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Bitcoin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input type="text" value={amount} readOnly className="pl-10 bg-gray-50" />
                  </div>
                  <Select value={targetCurrency} onValueChange={(value) => {}}>
                    <SelectTrigger className="w-full sm:w-[100px] sm:ml-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading || !connected}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue to Banxa"
                  )}
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500 mt-2">
                Powered by Banxa. By continuing, you agree to Banxa's Terms of Service.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BanxaOnrampModal

