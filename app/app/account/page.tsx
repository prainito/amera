"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Copy,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function AccountPage() {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [privateKeyDialogOpen, setPrivateKeyDialogOpen] = useState(false)

  // Mock data
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
  const privateKey = "0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f"
  const balance = 1250.75
  const verificationLevel = 2
  const maxVerificationLevel = 3
  const recentTransactions = [
    { id: "tx1", type: "deposit", amount: 500, date: "2023-05-15", status: "completed" },
    { id: "tx2", type: "withdrawal", amount: 200, date: "2023-05-10", status: "completed" },
    { id: "tx3", type: "transfer", amount: 50, date: "2023-05-05", status: "completed" },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">My Account</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Your account details and balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Balance</p>
                    <p className="text-3xl font-bold text-blue-600">${balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium font-mono truncate">
                        {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 6)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(walletAddress)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-lg font-medium">Active</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Verification Level</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-lg font-medium">
                          Level {verificationLevel} of {maxVerificationLevel}
                        </p>
                        {verificationLevel < maxVerificationLevel && (
                          <Button variant="link" className="p-0 h-auto">
                            Upgrade
                          </Button>
                        )}
                      </div>
                      <Progress value={(verificationLevel / maxVerificationLevel) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center">
                        {tx.type === "deposit" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-500 mr-3" />
                        ) : tx.type === "withdrawal" ? (
                          <ArrowUpRight className="h-5 w-5 text-red-500 mr-3" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-blue-500 mr-3" />
                        )}
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === "deposit" ? "text-green-600" : "text-gray-900"}`}>
                          {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-center">
                <Link href="/app/transactions">
                  <Button variant="link">View All Transactions</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common account management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  <Link href="/app/transactions">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center w-full">
                      <Download className="h-5 w-5 mb-2" />
                      <span>Download Statements</span>
                    </Button>
                  </Link>

                  <Dialog open={privateKeyDialogOpen} onOpenChange={setPrivateKeyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center justify-center w-full"
                      >
                        <Eye className="h-5 w-5 mb-2" />
                        <span>Export Private Key</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Private Key</DialogTitle>
                        <DialogDescription>
                          Your private key gives full access to your wallet. Never share it with anyone.
                        </DialogDescription>
                      </DialogHeader>

                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          Anyone with your private key can access your funds. Keep it secure and never share it.
                        </AlertDescription>
                      </Alert>

                      <div className="relative mt-4">
                        <div className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all">
                          {showPrivateKey
                            ? privateKey
                            : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                        >
                          {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>

                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center"
                          onClick={() => copyToClipboard(privateKey)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                        <Button onClick={() => setPrivateKeyDialogOpen(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Link href="/app/send?tab=receive">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center w-full">
                      <QrCode className="h-5 w-5 mb-2" />
                      <span>Show QR Code</span>
                    </Button>
                  </Link>

                  <Link href="/app/earn">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center w-full">
                      <Banknote className="h-5 w-5 mb-2" />
                      <span>Earn Interest</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Details</CardTitle>
                <CardDescription>Your digital wallet information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Wallet Address</Label>
                  <div className="mt-1 flex items-center">
                    <div className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all flex-1">{walletAddress}</div>
                    <Button variant="ghost" size="icon" className="ml-2" onClick={() => copyToClipboard(walletAddress)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Network</Label>
                  <p className="mt-1 text-lg font-medium">Ethereum Mainnet</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Wallet Type</Label>
                  <p className="mt-1 text-lg font-medium">HD Wallet (BIP39)</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="mt-1 text-lg font-medium">January 15, 2023</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Balances</CardTitle>
                <CardDescription>Your current holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium">Digital USD</p>
                      <p className="text-sm text-gray-500">USDC</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${balance.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">≈ {balance.toLocaleString()} USDC</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium">Ethereum</p>
                      <p className="text-sm text-gray-500">ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">0.15 ETH</p>
                      <p className="text-sm text-gray-500">≈ $300.00</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-medium">Total Balance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">${(balance + 300).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Link href="/app/send?tab=receive">
                    <Button className="w-full">Deposit</Button>
                  </Link>
                  <Link href="/app/send">
                    <Button variant="outline" className="w-full">
                      Withdraw
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Limits</CardTitle>
                <CardDescription>Your current transaction limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Daily Withdrawal</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">$2,000 / $10,000</p>
                        <p className="text-sm text-gray-500">20%</p>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Monthly Withdrawal</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">$5,000 / $50,000</p>
                        <p className="text-sm text-gray-500">10%</p>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Daily Deposit</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">$3,000 / $20,000</p>
                        <p className="text-sm text-gray-500">15%</p>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="link" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Increase Limits with Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button>Update Password</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="block">
                      Enable 2FA
                    </Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts" className="block">
                      Login Alerts
                    </Label>
                    <p className="text-sm text-gray-500">Receive notifications when your account is accessed</p>
                  </div>
                  <Switch id="login-alerts" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Device Management</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-sm text-gray-500">Chrome on macOS • Last active now</p>
                    </div>
                    <div className="text-green-500 text-sm font-medium">Current</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">iPhone 13</p>
                      <p className="text-sm text-gray-500">Safari on iOS • Last active 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your application experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="block">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-500">Enable dark mode for the application</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Currency Display</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-usd" className="block">
                      Show USD Value
                    </Label>
                    <p className="text-sm text-gray-500">Display USD equivalent for all balances</p>
                  </div>
                  <Switch id="show-usd" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language</h3>
                <div className="space-y-2">
                  <Label htmlFor="language">Select Language</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-transactions" className="block">
                        Transaction Updates
                      </Label>
                      <p className="text-sm text-gray-500">Receive push notifications about your transactions</p>
                    </div>
                    <Switch id="push-transactions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-security" className="block">
                        Security Alerts
                      </Label>
                      <p className="text-sm text-gray-500">Receive push notifications about security events</p>
                    </div>
                    <Switch id="push-security" defaultChecked />
                  </div>
                </div>
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

