"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Mail, ArrowRight, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { createWalletForUser, encryptPrivateKey } from "@/lib/blockchain/wallet-service"

interface UnifiedAuthProps {
  mode: "login" | "signup"
  onSuccess?: () => void
}

export default function UnifiedAuth({ mode, onSuccess }: UnifiedAuthProps) {
  const router = useRouter()
  const { connectWallet, connected, address, setUserInfo } = useWallet()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [walletLoading, setWalletLoading] = useState(false)

  const handleTraditionalAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "signup") {
        // Create a new wallet for the user
        const wallet = await createWalletForUser()

        // Encrypt the private key with the user's password
        const encryptedKey = await encryptPrivateKey(wallet.privateKey, password)

        // In a real implementation, you would send this to your backend:
        // - User's email, name, password (hashed)
        // - Wallet address
        // - Encrypted private key
        console.log("Creating account with wallet:", {
          email,
          name,
          address: wallet.address,
          // Don't log the actual encrypted key in production
        })

        // Set user info in the context
        setUserInfo(email, name, wallet.address, encryptedKey)
      } else {
        // For login, you would:
        // 1. Authenticate with backend
        // 2. Retrieve the user's encrypted private key
        // 3. Set the user info in context
        console.log("Logging in:", email)

        // Mock implementation - in real app, you'd get this from your backend
        const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
        const mockEncryptedKey = "encrypted_key_would_come_from_backend"
        setUserInfo(email, "User Name", mockAddress, mockEncryptedKey)
      }

      // Redirect to dashboard after successful auth
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/app/dashboard")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      // Handle error (show message, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletAuth = async () => {
    setWalletLoading(true)
    try {
      if (!connected) {
        await connectWallet()
      }

      // In a real implementation, you would verify the wallet on your backend
      // For example, have the user sign a message to prove ownership
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mode === "signup") {
        // Register the wallet address in your system
        console.log("Registering wallet:", address)
      } else {
        // Log in with wallet
        console.log("Logging in with wallet:", address)
      }

      // Redirect to dashboard after successful auth
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/app/dashboard")
      }
    } catch (error) {
      console.error("Wallet authentication error:", error)
      // Handle error
    } finally {
      setWalletLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Log In to Amera" : "Create Your Amera Account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Access your Amera account to manage your digital assets"
            : "Join Amera to start earning interest on your digital assets"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="traditional" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="traditional">
              <Mail className="h-4 w-4 mr-2" />
              <span>{mode === "login" ? "Email Login" : "Email Signup"}</span>
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              <span>{mode === "login" ? "Wallet Login" : "Wallet Signup"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traditional">
            <form onSubmit={handleTraditionalAuth} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-600 flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p>
                    We'll automatically create a secure digital wallet for you. You'll be able to access and export your
                    wallet keys anytime from settings.
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Log In" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="wallet">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-blue-800">
                  {mode === "login" ? "Log In with Your Wallet" : "Create Account with Your Wallet"}
                </h3>
                <p className="text-sm text-gray-600">
                  {mode === "login"
                    ? "Connect your wallet to access your Amera account. No password needed."
                    : "Connect your wallet to create an Amera account. Your wallet will be your secure key to access your account."}
                </p>
              </div>

              <Button
                onClick={handleWalletAuth}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={walletLoading}
              >
                {walletLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {connected ? "Authenticating..." : "Connecting wallet..."}
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    {connected
                      ? `Continue with Connected Wallet (${address?.substring(0, 6)}...${address?.substring(address?.length - 4)})`
                      : `Connect Wallet to ${mode === "login" ? "Log In" : "Sign Up"}`}
                  </>
                )}
              </Button>

              {mode === "signup" && (
                <div className="text-sm text-gray-500 mt-2">
                  By connecting your wallet, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <div className="text-sm text-gray-500">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </a>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

