"use client"

import { useState, useEffect } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/blockchain/wallet-context"

export function ReceiveForm() {
  const { toast } = useToast()
  const { connected, address } = useWallet()
  const [qrCode, setQrCode] = useState<string | null>(null)

  useEffect(() => {
    if (connected && address) {
      // In a real app, generate QR code for the address
      // For this demo, we'll just use a placeholder
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`)
    } else {
      setQrCode(null)
    }
  }, [connected, address])

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {connected ? (
            <>
              <div className="flex justify-center">
                {qrCode && (
                  <div className="border p-4 rounded-lg bg-white">
                    <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddress">Your Wallet Address</Label>
                <div className="flex">
                  <Input id="walletAddress" value={address || ""} readOnly className="rounded-r-none" />
                  <Button variant="outline" size="icon" className="rounded-l-none" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Share this address to receive tokens. Only send compatible tokens to this address.</p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to view your receive address</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

