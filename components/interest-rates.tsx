"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import SignupModal from "./signup-modal"

export default function InterestRates() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  const assets = [
    { name: "Digital USD (USDC)", rate: "8.0%", risk: "Low", liquidity: "High" },
    { name: "Bitcoin (BTC)", rate: "5.2%", risk: "Medium", liquidity: "High" },
    { name: "Ethereum (ETH)", rate: "6.1%", risk: "Medium", liquidity: "High" },
    { name: "Solana (SOL)", rate: "7.5%", risk: "Medium", liquidity: "High" },
  ]

  return (
    <section id="interest-rates" className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Interest Rates</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Put Your Money to Work</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Earn competitive interest rates on Digital USD and other crypto assets.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Current Interest Rates</CardTitle>
              <CardDescription>Rates are variable and updated regularly based on market conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Interest Rate (APY)</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Liquidity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.name}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell className="text-blue-600 font-semibold">{asset.rate}</TableCell>
                      <TableCell>{asset.risk}</TableCell>
                      <TableCell>{asset.liquidity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="mt-6 text-sm text-gray-500 text-center">
            Note: Interest rates are variable and subject to change based on market conditions. Past performance is not
            indicative of future results.
          </div>

          {/* New Sign Up Button */}
          <div className="mt-10 flex justify-center">
            <Button
              size="xl"
              className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-10"
              onClick={() => setIsSignupModalOpen(true)}
            >
              Sign Up and Start Earning
            </Button>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </section>
  )
}

