"use client"

import type React from "react"

import { useState } from "react"
import { X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
  }

  const handleClose = () => {
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
              <h2 className="text-2xl font-bold mb-1">Withdraw</h2>
              <p className="text-gray-500 mb-6">Withdraw your digital USD to your bank account or crypto wallet</p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-500 mb-1">Digital USD balance:</div>
                <div className="text-2xl font-bold">$1,500</div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="withdraw-amount" className="text-sm font-medium">
                      Withdraw Amount
                    </label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="text-lg mt-1"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-gray-500 mb-2">Amera Digital USD Savers Vault: 8.5%</div>
                    <div className="text-sm text-gray-500">Estimated Annual Earnings: $500</div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Withdraw
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-1">Withdrawal Successful</h2>
              <p className="text-gray-500 mb-6">Your withdrawal request has been processed successfully.</p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-500 mb-1">Withdrawal Amount:</div>
                <div className="text-2xl font-bold">${amount} USD</div>
              </div>

              <div className="text-sm text-gray-500 mb-6">Transaction Number: 5678</div>

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

