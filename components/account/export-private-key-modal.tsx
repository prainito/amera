"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Copy, Eye, EyeOff, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportPrivateKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportPrivateKeyModal({ isOpen, onClose }: ExportPrivateKeyModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [password, setPassword] = useState("")
  const [showKey, setShowKey] = useState(false)

  // This would be fetched securely from your backend in a real implementation
  const mockPrivateKey = "8f4b8f2c0c3e0a3a0e0a0e0a0e0a0e0a0e0a0e0a0e0a0e0a0e0a0e0a0e0a0e0a"

  const handleSubmitPassword = () => {
    // In a real implementation, you would verify the password with your backend
    if (password) {
      setStep(2)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockPrivateKey)
    toast({
      title: "Private key copied",
      description: "Your private key has been copied to clipboard",
    })
  }

  const handleClose = () => {
    setStep(1)
    setPassword("")
    setShowKey(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Export Private Key</DialogTitle>
              <DialogDescription>Please enter your password to continue</DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Security Warning</p>
                  <p>
                    Your private key is the only way to access your funds. Never share it with anyone. Anyone with your
                    private key has complete control over your funds.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmitPassword} disabled={!password}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Your Private Key</DialogTitle>
              <DialogDescription>Keep this key secure and never share it with anyone</DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Critical Security Warning</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Anyone with this key can steal your funds</li>
                    <li>Never share this key with anyone</li>
                    <li>Never enter this key on any website</li>
                    <li>Store it securely, preferably offline</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="privateKey">Private Key</Label>
                  <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)} className="h-8 px-2">
                    {showKey ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" /> Show
                      </>
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <div className="flex">
                    <div className="bg-gray-100 p-3 rounded-md font-mono text-sm w-full overflow-x-auto">
                      {showKey ? mockPrivateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </div>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="ml-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // In a real implementation, you would generate a downloadable file
                  toast({
                    title: "Private key saved",
                    description: "Your private key has been saved as a file",
                  })
                }}
                className="flex items-center"
              >
                <Lock className="mr-2 h-4 w-4" /> Save as File
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

