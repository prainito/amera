"use client"

import type React from "react"

import { useState } from "react"
import { X, DollarSign, ArrowRight, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useWallet } from "@/lib/blockchain/wallet-context"

interface VaultWithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  vaultId: string | null
}

export default function VaultWithdrawModal({ isOpen, onClose, vaultId }: VaultWithdrawModalProps) {
  const { connected } = useWallet()
  const [amount, setAmount] = useState<string>("100")
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<"input" | "confirm" | "success">("input")

  // Mock data for the vaults
  const vaultData = {
    safe: {
      name: "Amera Safe Vault",
      apy: 5.2,
      userDeposit: 1000,
      riskLevel: "Low",
      withdrawalFee: 0,
    },
    growth: {
      name: "Amera Growth Vault",
      apy: 10.2,
      userDeposit: 750,
      riskLevel: "Medium",
      withdrawalFee: 0.1,
    },
    opportunity: {
      name: "Amera Opportunity Vault",
      apy: 15.8,
      userDeposit: 500,
      riskLevel: "Higher",
      withdrawalFee: 0.2,
    },
  }

  const selectedVault = vaultId ? vaultData[vaultId as keyof typeof vaultData] : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep("confirm")
    } catch (error) {
      console.error("Error preparing withdrawal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep("success")
    } catch (error) {
      console.error("Error confirming withdrawal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAmount("100")
    setStep("input")
    onClose()
  }

  const calculateFee = () => {
    if (!selectedVault) return 0
    return (Number.parseFloat(amount) * selectedVault.withdrawalFee) / 100
  }

  const calculateNet = () => {
    if (!selectedVault) return 0
    return Number.parseFloat(amount) - calculateFee()
  }

  if (!isOpen || !selectedVault) return null

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
          {step === "input" && (
            <>
              <h2 className="text-2xl font-bold mb-1">Withdraw from {selectedVault.name}</h2>
              <p className="text-gray-500 mb-6">Withdraw your funds from the vault</p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="flex justify-between">
                      <span>Amount</span>
                      <span className="text-gray-500">Balance: ${selectedVault.userDeposit.toLocaleString()}</span>
                    </Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Percentage of balance</Label>
                      <span className="text-sm text-gray-500">
                        {((Number.parseFloat(amount) / selectedVault.userDeposit) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[Math.min((Number.parseFloat(amount) / selectedVault.userDeposit) * 100, 100)]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => {
                        setAmount(((selectedVault.userDeposit * value[0]) / 100).toFixed(2))
                      }}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAmount((selectedVault.userDeposit * 0.25).toFixed(2))}
                    >
                      25%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAmount((selectedVault.userDeposit * 0.5).toFixed(2))}
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAmount((selectedVault.userDeposit * 0.75).toFixed(2))}
                    >
                      75%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAmount(selectedVault.userDeposit.toFixed(2))}
                    >
                      Max
                    </Button>
                  </div>

                  {selectedVault.withdrawalFee > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Withdrawal Fee ({selectedVault.withdrawalFee}%)</span>
                        <span className="text-sm font-medium">${calculateFee().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">You will receive</span>
                        <span className="text-sm font-medium">${calculateNet().toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={
                        loading ||
                        Number.parseFloat(amount) <= 0 ||
                        Number.parseFloat(amount) > selectedVault.userDeposit
                      }
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}

          {step === "confirm" && (
            <>
              <h2 className="text-2xl font-bold mb-1">Confirm Withdrawal</h2>
              <p className="text-gray-500 mb-6">Please review your withdrawal details before confirming</p>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Vault</div>
                      <div className="font-medium">{selectedVault.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="font-medium">${Number.parseFloat(amount).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {selectedVault.withdrawalFee > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Withdrawal Fee ({selectedVault.withdrawalFee}%)</span>
                      <span className="text-sm font-medium">${calculateFee().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">You will receive</span>
                      <span className="text-sm font-medium">${calculateNet().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p>
                      Withdrawals are typically processed within minutes, but may take longer during periods of high
                      network congestion.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("input")} disabled={loading}>
                    Back
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleConfirm} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Withdrawal"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Withdrawal Successful</h2>
              <p className="text-gray-500 mb-6">
                Your withdrawal of ${Number.parseFloat(amount).toFixed(2)} from {selectedVault.name} has been processed
                successfully.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-500 mb-1">Amount Received</div>
                <div className="text-2xl font-bold">${calculateNet().toFixed(2)}</div>
              </div>

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

