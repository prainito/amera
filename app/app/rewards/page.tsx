"use client"

import { useState } from "react"
import { Copy, Check, Share2, Gift, Award, Sparkles, ChevronRight, Users, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("referrals")
  const [copied, setCopied] = useState(false)
  const [isMember, setIsMember] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("joinamera.com/user")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Amera",
        text: "Join Amera and get $10 in USDC when you sign up!",
        url: "joinamera.com/user",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rewards & Referrals</h1>
          <p className="text-gray-500 mt-1">Earn rewards by referring friends and participating in promotions</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          <span>Share Amera</span>
        </Button>
      </div>

      {/* Rewards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-blue-100 p-2">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-blue-600">Total Rewards Earned</p>
              <h3 className="text-2xl font-bold mt-1">$500</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-purple-100 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-purple-600">Friends Referred</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-green-100 p-2">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-green-600">Available to Withdraw</p>
              <h3 className="text-2xl font-bold mt-1">$125</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="referrals">Referral Program</TabsTrigger>
          <TabsTrigger value="club">Amera Club</TabsTrigger>
        </TabsList>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Refer Friends, Earn Rewards</CardTitle>
              <CardDescription>
                Earn 1% of your friends' interest earnings when they join Amera using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Referral Link</label>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-50 border rounded-md px-4 py-2 flex-1 text-sm truncate">
                    joinamera.com/user
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="whitespace-nowrap">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* How it works */}
              <div className="space-y-3">
                <h3 className="font-medium">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-blue-600">1</span>
                    </div>
                    <p className="text-sm">Share your unique referral link with friends</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-blue-600">2</span>
                    </div>
                    <p className="text-sm">They sign up and deposit at least $100</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-blue-600">3</span>
                    </div>
                    <p className="text-sm">You both earn rewards automatically</p>
                  </div>
                </div>
              </div>

              {/* Referral Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Monthly Referral Goal</h3>
                  <span className="text-sm text-gray-500">3 of 5 referrals</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-sm text-gray-500">Refer 2 more friends this month to earn a $50 bonus!</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button className="w-full sm:w-auto">
                <Gift className="h-4 w-4 mr-2" />
                Invite Friends
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                View Referral History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Amera Club Tab */}
        <TabsContent value="club" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Amera Club</CardTitle>
              <CardDescription>Exclusive benefits and rewards for Amera Club members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isMember ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">You're an Amera Club Member!</h3>
                    <p className="text-sm text-green-700">Your membership renews on April 15, 2025</p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800">Join Amera Club Today</h3>
                  <p className="text-sm text-blue-700 mt-1">First month free, then just $0.99/month</p>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-3">
                <h3 className="font-medium">Membership Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Exclusive Deals</h4>
                      <p className="text-sm text-gray-600">Special discounts at over 500 partner merchants</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Higher Rewards</h4>
                      <p className="text-sm text-gray-600">Earn 1.5x rewards points on all transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Birthday Bonus</h4>
                      <p className="text-sm text-gray-600">Get $10 in USDC on your birthday</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Deals */}
              <div className="space-y-3">
                <h3 className="font-medium">Featured Deals This Month</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <h4 className="font-medium">Amazon</h4>
                        <p className="text-sm text-gray-600">10% off your next purchase</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <h4 className="font-medium">Starbucks</h4>
                        <p className="text-sm text-gray-600">Buy one, get one free</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isMember ? (
                <Button variant="outline" className="w-full" onClick={() => setIsMember(false)}>
                  Cancel Membership
                </Button>
              ) : (
                <Button className="w-full" onClick={() => setIsMember(true)}>
                  Join for $0.99/month
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

