"use client"

import type React from "react"

import { useState } from "react"
import { X, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { requestOTCQuote, calculateOTCFee, type OTCQuote } from "@/lib/services/otc-service"

interface OTCRequestModalProps {
  isOpen: boolean
  onClose: () => void
  initialAmount?: number
}

export default function OTCRequestModal({ isOpen, onClose, initialAmount = 50000 }: OTCRequestModalProps) {
  const { address } = useWallet()
  const [step, setStep] = useState<"form" | "quote" | "success">("form")
  const [direction, setDirection] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState<string>(initialAmount.toString())
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [currency, setCurrency] = useState<string>("USD")
  const [targetCurrency, setTargetCurrency] = useState<string>("BTC")
  const [additionalInfo, setAdditionalInfo] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [quote, setQuote] = useState<OTCQuote | null>(null)

  // Calculate fee based on amount
  const { fee, percentage } = calculateOTCFee(Number.parseFloat(amount) || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Number.parseFloat(amount) < 50000) {
      alert("OTC service is only available for transactions of $50,000 or more")
      return
    }

    setLoading(true)

    try {
      const quoteResult = await requestOTCQuote({
        name,
        email,
        phone,
        amount: Number.parseFloat(amount),
        currency,
        targetCurrency,
        direction,
        additionalInfo,
      })

      setQuote(quoteResult)
      setStep("quote")
    } catch (error) {
      console.error("Error requesting OTC quote:", error)
      alert("There was an error processing your request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = async () => {
    if (!quote) return

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setStep("success")
    } catch (error) {
      console.error("Error accepting OTC quote:", error)
      alert("There was an error accepting the quote. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep("form")
    setQuote(null)
    setAmount(initialAmount.toString())
    setName("")
    setEmail("")
    setPhone("")
    setAdditionalInfo("")
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
          {step === "form" && (
            <>
              <h2 className="text-2xl font-bold mb-1">OTC Request</h2>
              <p className="text-gray-500 mb-6">
                For transactions of $50,000 or more, our OTC desk offers competitive rates with only{" "}
                {percentage.toFixed(2)}% fee.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label>I want to</Label>
                    <RadioGroup
                      value={direction}
                      onValueChange={(value) => setDirection(value as "buy" | "sell")}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buy" id="otc-buy" />
                        <Label htmlFor="otc-buy" className="cursor-pointer">
                          Buy Crypto
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sell" id="otc-sell" />
                        <Label htmlFor="otc-sell" className="cursor-pointer">
                          Sell Crypto
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="otc-amount">Amount</Label>
                    <div className="flex flex-col sm:flex-row mt-1 gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="otc-amount"
                          type="number"
                          min="50000"
                          step="1000"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <Select value={currency} onValueChange={setCurrency}>
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

                  <div>
                    <Label htmlFor="otc-target">Target Currency</Label>
                    <Select value={targetCurrency} onValueChange={setTargetCurrency} className="mt-1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="otc-name">Full Name</Label>
                    <Input
                      id="otc-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="otc-email">Email</Label>
                    <Input
                      id="otc-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="otc-phone">Phone Number</Label>
                    <Input
                      id="otc-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="otc-info">Additional Information (Optional)</Label>
                    <Textarea
                      id="otc-info"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Request Quote"
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-xs text-gray-500 mt-2">
                    Our OTC desk will process your request and provide a quote within 30 minutes during business hours.
                  </div>
                </div>
              </form>
            </>
          )}

          {step === "quote" && quote && (
            <>
              <h2 className="text-2xl font-bold mb-1">OTC Quote</h2>
              <p className="text-gray-500 mb-6">
                Review your quote below. This quote is valid for{" "}
                {new Date(quote.expiresAt).getMinutes() - new Date().getMinutes()} minutes.
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">You {direction === "buy" ? "pay" : "sell"}</span>
                    <span className="font-semibold">
                      {quote.amount.toLocaleString()} {quote.currency}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Fee ({quote.feePercentage.toFixed(2)}%)</span>
                    <span className="font-semibold">
                      {quote.fee.toLocaleString()} {quote.currency}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Exchange Rate</span>
                    <span className="font-semibold">
                      1 {quote.currency} = {quote.exchangeRate.toFixed(6)} {quote.targetCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-500">You {direction === "buy" ? "receive" : "get"}</span>
                    <span className="font-bold">
                      {quote.targetAmount.toLocaleString()} {quote.targetCurrency}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleAcceptQuote}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Accept Quote"
                    )}
                  </Button>
                  <Button onClick={resetForm} variant="outline" className="w-full mt-2">
                    Modify Request
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "success" && (
            <>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Request Submitted</h2>
                <p className="text-gray-500 mb-6">
                  Your OTC request has been submitted successfully. Our team will contact you shortly at {email} to
                  complete the transaction.
                </p>
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

