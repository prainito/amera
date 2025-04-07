"use client"

import type React from "react"

import { useState } from "react"
import { X, CreditCard, BanknoteIcon as Bank, ArrowRight } from "lucide-react"
import { AppleIcon } from "@/components/icons/apple-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [step, setStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method)
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
  }

  const handleClose = () => {
    setStep(1)
    setSelectedMethod(null)
    setAmount("")
    setIsSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          {!isSuccess ? (
            <>
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-1">Convert to Digital USD</h2>
                  <p className="text-gray-500 mb-6">Select a payment method to convert your funds to Digital USD</p>

                  <div className="space-y-3">
                    <Card
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleMethodSelect("apple-pay")}
                    >
                      <CardContent className="p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-4">
                          <AppleIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Apple Pay/Google Pay</div>
                          <div className="text-sm text-gray-500">Instant conversion</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleMethodSelect("card")}
                    >
                      <CardContent className="p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Debit or Credit Card</div>
                          <div className="text-sm text-gray-500">Fee: 1.5%</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleMethodSelect("bank")}
                    >
                      <CardContent className="p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <Bank className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Bank Transfer</div>
                          <div className="text-sm text-gray-500">1-3 business days</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-500">Estimated fees: $0.005</div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-1">Convert and earn on your Digital USD</h2>
                  <p className="text-gray-500 mb-6">
                    Own Digital USD, and earn interest from lending your Digital USD. Withdraw anytime.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label htmlFor="amount" className="text-sm font-medium">
                            Amount
                          </label>
                          <span className="text-sm text-gray-500">Estimated Fees: $0.005</span>
                        </div>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          className="text-lg"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setAmount("25")}>
                          $25
                        </Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setAmount("100")}>
                          $100
                        </Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setAmount("1000")}>
                          $1,000
                        </Button>
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Convert to Digital USD
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-1">Deposit Successful</h2>
              <p className="text-gray-500 mb-6">
                You have successfully converted your funds and deposited Digital USD.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-500 mb-1">Total Funds:</div>
                <div className="text-2xl font-bold">$1,000 Digital USD</div>
              </div>

              <div className="text-sm text-gray-500 mb-6">Transaction Number: 1234</div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

