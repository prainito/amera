"use client"

import { useState } from "react"
import { Shield, Download, Copy, Eye, EyeOff, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { decryptPrivateKey, exportWalletAsKeystore } from "@/lib/blockchain/wallet-service"

export default function ExportPrivateKey() {
  const { encryptedPrivateKey, address } = useWallet()
  const [password, setPassword] = useState("")
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [keystoreGenerated, setKeystoreGenerated] = useState(false)

  // If no encrypted private key is available, show a message
  if (!encryptedPrivateKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export Private Key</CardTitle>
          <CardDescription>Access your wallet's private key for use with external wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              No wallet is associated with this account. This feature is only available for accounts with a wallet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleDecrypt = async () => {
    if (!encryptedPrivateKey || !password) return

    setLoading(true)
    setError(null)

    try {
      const decryptedKey = await decryptPrivateKey(encryptedPrivateKey, password)
      setPrivateKey(decryptedKey)
    } catch (error) {
      setError("Incorrect password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPrivateKey = () => {
    if (!privateKey) return

    navigator.clipboard.writeText(privateKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadKeystore = async () => {
    if (!privateKey || !password) return

    try {
      const keystore = await exportWalletAsKeystore(privateKey, password)

      // Create a blob and download link
      const blob = new Blob([keystore], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `amera-wallet-${address?.substring(0, 6)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setKeystoreGenerated(true)
      setTimeout(() => setKeystoreGenerated(false), 2000)
    } catch (error) {
      console.error("Error generating keystore:", error)
      setError("Failed to generate keystore file. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Private Key</CardTitle>
        <CardDescription>Access your wallet's private key for use with external wallets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg flex items-start">
          <Shield className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <p className="font-semibold mb-1">Security Warning</p>
            <p>
              Your private key is the master key to your wallet and funds. Never share it with anyone, and store it
              securely. Anyone with your private key has complete control over your wallet.
            </p>
          </div>
        </div>

        {!privateKey ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Enter your password to decrypt your wallet</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <Button onClick={handleDecrypt} disabled={!password || loading} className="w-full">
              {loading ? "Decrypting..." : "Decrypt Wallet"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey">Your Private Key</Label>
              <div className="relative">
                <Input
                  id="privateKey"
                  type={showPrivateKey ? "text" : "password"}
                  value={privateKey}
                  readOnly
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPrivateKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleCopyPrivateKey} className="flex-1" variant={copied ? "outline" : "default"}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy Private Key
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownloadKeystore}
                className="flex-1"
                variant={keystoreGenerated ? "outline" : "default"}
              >
                {keystoreGenerated ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Downloaded
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Keystore File
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-2 mt-4">
              <p className="font-medium">How to import into MetaMask:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open MetaMask and click on your account icon</li>
                <li>Select "Import Account"</li>
                <li>Choose "Private Key" or "JSON File" (for keystore)</li>
                <li>Paste your private key or select the downloaded keystore file</li>
                <li>Follow the prompts to complete the import</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

