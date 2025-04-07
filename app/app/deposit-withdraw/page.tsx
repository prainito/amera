"use client"

import { useState } from "react"
import { CreditCard, ArrowUpDown, DollarSign, Banknote, Landmark, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { BanxaOnrampModal } from "@/components/onramp/banxa-onramp-modal"
import OTCRequestModal from "@/components/otc/otc-request-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function RampPage() {
  const [banxaModalOpen, setBanxaModalOpen] = useState(false)
  const [otcModalOpen, setOtcModalOpen] = useState(false)
  const { connected } = useWallet()

  return (
    <>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Deposit & Withdraw</h1>
          <p className="text-gray-500 mt-2">Easily deposit or withdraw funds using our secure payment services</p>
        </div>

        <Tabs defaultValue="standard" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="otc">OTC (Large Transactions)</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Buy Crypto
                  </CardTitle>
                  <CardDescription>
                    Convert your fiat currency to digital assets using our secure payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Credit/Debit Card</span>
                    </div>
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Bank Transfer</span>
                    </div>
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Apple Pay/Google Pay</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setBanxaModalOpen(true)}>
                    Buy Crypto
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Landmark className="h-5 w-5 mr-2 text-green-600" />
                    Sell Crypto
                  </CardTitle>
                  <CardDescription>
                    Convert your digital assets back to fiat currency and withdraw to your bank account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Sell from your wallet</span>
                    </div>
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Receive funds via bank transfer</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Multiple currencies supported</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setBanxaModalOpen(true)}>
                    Sell Crypto
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>About Our Deposit & Withdraw Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Our deposit and withdrawal services are powered by Banxa, a regulated payment service provider that
                    offers secure and compliant fiat-to-crypto conversions in over 180 countries.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Secure</h3>
                      <p className="text-sm text-gray-600">Bank-level security and encryption for all transactions</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Compliant</h3>
                      <p className="text-sm text-gray-600">
                        Fully regulated and compliant with local laws and regulations
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Global</h3>
                      <p className="text-sm text-gray-600">
                        Available in over 180 countries with multiple payment methods
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="otc" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUpDown className="h-5 w-5 mr-2 text-blue-600" />
                  OTC Trading Desk
                </CardTitle>
                <CardDescription>
                  For large transactions of $50,000 or more, our OTC desk offers competitive rates with reduced fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Competitive Rates</h3>
                    <p className="text-gray-600 mb-2">Our OTC desk offers preferential rates for large transactions:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>$50,000 - $99,999: 0.30% fee</li>
                      <li>$100,000 - $499,999: 0.25% fee</li>
                      <li>$500,000+: 0.20% fee</li>
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Personalized Service</h3>
                      <p className="text-sm text-gray-600">Dedicated account manager to handle your transaction</p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Deep Liquidity</h3>
                      <p className="text-sm text-gray-600">Access to deep liquidity pools for minimal slippage</p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Secure Settlement</h3>
                      <p className="text-sm text-gray-600">Secure and compliant settlement process</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setOtcModalOpen(true)}>
                      Request OTC Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">What payment methods are supported?</h3>
                  <p className="text-gray-600">
                    We support credit/debit cards, bank transfers, and mobile payment methods like Apple Pay and Google
                    Pay. Available payment methods may vary by country.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">How long do transactions take?</h3>
                  <p className="text-gray-600">
                    Card payments are typically processed within minutes. Bank transfers may take 1-3 business days
                    depending on your bank and country.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">What are the fees?</h3>
                  <p className="text-gray-600">
                    Fees vary depending on the payment method and transaction amount. You'll see the exact fees before
                    confirming your transaction.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Is KYC required?</h3>
                  <p className="text-gray-600">
                    Yes, Know Your Customer (KYC) verification is required for regulatory compliance. The verification
                    process is quick and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <BanxaOnrampModal isOpen={banxaModalOpen} onClose={() => setBanxaModalOpen(false)} />
      <OTCRequestModal isOpen={otcModalOpen} onClose={() => setOtcModalOpen(false)} initialAmount={50000} />
    <>
  )
}

