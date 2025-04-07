"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react" // Updated import statement
import { Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReferralQRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReferralQRModal({ open, onOpenChange }: ReferralQRModalProps) {
  const { address } = useWallet()
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)

  // Generate referral link based on user's address or a unique ID
  useEffect(() => {
    if (address) {
      // In production, you might want to use a shorter code or a proper referral system
      const baseUrl = window.location.origin
      setReferralLink(`${baseUrl}/signup?ref=${address?.slice(0, 10)}`)
    }
  }, [address])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Amera Digital USD",
          text: "Sign up for Amera Digital USD using my referral link and we both earn rewards!",
          url: referralLink,
        })
      } catch (err) {
        console.error("Error sharing: ", err)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refer a Friend</DialogTitle>
          <DialogDescription>
            Share this QR code or link with friends. You'll earn rewards when they sign up and complete qualifying
            actions.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="link">Referral Link</TabsTrigger>
          </TabsList>

          <TabsContent value="qrcode" className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-lg">
              {referralLink && <QRCodeSVG value={referralLink} size={200} level="H" includeMargin={true} />}
            </div>
          </TabsContent>

          <TabsContent value="link" className="py-4">
            <div className="flex items-center space-x-2">
              <div className="border rounded-md px-3 py-2 bg-muted flex-1 truncate">{referralLink}</div>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>}
          </TabsContent>
        </Tabs>

        <div className="flex flex-col space-y-3 mt-2">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Referral Rewards:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Earn $10 when your friend signs up</li>
              <li>Earn 5% of their earnings for 3 months</li>
              <li>They get $5 signup bonus using your link</li>
            </ul>
          </div>

          <Button onClick={shareReferral} className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share Referral
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

