"use client"

import { useState, useEffect } from "react"
import { Calculator, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InterestCalculator() {
  const [amount, setAmount] = useState(1000)
  const [period, setPeriod] = useState(12) // months
  const [interestRate, setInterestRate] = useState(8) // 8% default
  const [earnings, setEarnings] = useState(0)
  const [totalValue, setTotalValue] = useState(0)

  // Calculate earnings whenever inputs change
  useEffect(() => {
    // Simple interest calculation for demonstration
    // In a real app, you might want to use compound interest
    const monthlyRate = interestRate / 100 / 12
    const calculatedEarnings = amount * monthlyRate * period
    setEarnings(calculatedEarnings)
    setTotalValue(amount + calculatedEarnings)
  }, [amount, period, interestRate])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <section className="py-16 md:py-24 bg-blue-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Calculator</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">See How Much You Could Earn</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Use our calculator to estimate your potential earnings with Amera.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-blue-600" />
                Interest Calculator
              </CardTitle>
              <CardDescription>Adjust the sliders to see your earning potential with Amera</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-6 pt-4">
                  {/* Amount Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Investment Amount</label>
                      <div className="flex items-center text-2xl font-semibold">
                        <DollarSign className="h-6 w-6 text-gray-500" />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-32 bg-white border-2 border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                        />
                      </div>
                    </div>
                    <Slider
                      value={[amount]}
                      min={100}
                      max={100000}
                      step={100}
                      onValueChange={(value) => setAmount(value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$100</span>
                      <span>$100,000</span>
                    </div>
                  </div>

                  {/* Time Period Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Time Period (Months)</label>
                      <span className="text-lg font-semibold">{period} months</span>
                    </div>
                    <Slider
                      value={[period]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setPeriod(value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 month</span>
                      <span>5 years</span>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="text-sm text-gray-500">Total Earnings</div>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(earnings)}</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="text-sm text-gray-500">Final Balance</div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6 pt-4">
                  {/* Amount Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Investment Amount</label>
                      <div className="flex items-center text-2xl font-semibold">
                        <DollarSign className="h-6 w-6 text-gray-500" />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-32 bg-white border-2 border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                        />
                      </div>
                    </div>
                    <Slider
                      value={[amount]}
                      min={100}
                      max={100000}
                      step={100}
                      onValueChange={(value) => setAmount(value[0])}
                      className="py-2"
                    />
                  </div>

                  {/* Time Period Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Time Period (Months)</label>
                      <span className="text-lg font-semibold">{period} months</span>
                    </div>
                    <Slider
                      value={[period]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setPeriod(value[0])}
                      className="py-2"
                    />
                  </div>

                  {/* Interest Rate Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Interest Rate (APY)</label>
                      <span className="text-lg font-semibold">{interestRate}%</span>
                    </div>
                    <Slider
                      value={[interestRate]}
                      min={1}
                      max={12}
                      step={0.1}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>12%</span>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="text-sm text-gray-500">Total Earnings</div>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(earnings)}</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="text-sm text-gray-500">Final Balance</div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-4 text-center">
                <Button size="xl" className="bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Start Earning Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

