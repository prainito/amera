"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ChevronRight, Clock, Copy, QrCode, Save, Search, Send, User, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SendPage() {
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [note, setNote] = useState("")
  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<any>(null)

  // Mock data - would come from your API in production
  const balance = 2750.45
  const recentContacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Michael Chen",
      address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emma Williams",
      address: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const contacts = [
    ...recentContacts,
    {
      id: 4,
      name: "David Rodriguez",
      address: "0x6c3E4cb2E96B01F4b866965A91ed4437839A121a",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Lisa Taylor",
      address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleContinue = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to send",
        variant: "destructive",
      })
      return
    }

    if (!recipient && !selectedContact) {
      toast({
        title: "Recipient required",
        description: "Please enter a recipient address or select a contact",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handleConfirm = () => {
    // Here you would call your API to process the transaction
    toast({
      title: "Transaction submitted",
      description: "Your transfer has been submitted successfully",
    })

    // Reset form and go back to step 1
    setAmount("")
    setRecipient("")
    setNote("")
    setSelectedContact(null)
    setStep(1)
  }

  const selectContact = (contact: any) => {
    setSelectedContact(contact)
    setRecipient(contact.address)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Address copied to clipboard",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const estimatedFee = 0.001 // This would be calculated based on current gas prices
  const totalAmount = Number.parseFloat(amount || "0") + estimatedFee

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Send & Receive Digital USD</h1>

      <Tabs defaultValue="send" className="w-full mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              {step === 1 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Send to Anyone</CardTitle>
                    <CardDescription>Transfer digital USD to any wallet address or contact</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          id="amount"
                          type="text"
                          placeholder="0.00"
                          value={amount}
                          onChange={handleAmountChange}
                          className="pl-7"
                        />
                      </div>
                      <div className="mt-1 text-sm text-gray-500 flex justify-between">
                        <span>Available: ${balance.toLocaleString()}</span>
                        <Button variant="link" className="p-0 h-auto" onClick={() => setAmount(balance.toString())}>
                          Send max
                        </Button>
                      </div>
                    </div>

                    <Tabs defaultValue="address" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="contacts">Contacts</TabsTrigger>
                      </TabsList>

                      <TabsContent value="address" className="space-y-4">
                        <div>
                          <Label htmlFor="recipient">Recipient Address</Label>
                          <div className="flex mt-1">
                            <Input
                              id="recipient"
                              placeholder="0x..."
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                              className="flex-1"
                            />
                            <Button variant="outline" className="ml-2" size="icon">
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                          {selectedContact && (
                            <div className="mt-2 text-sm">
                              Sending to: <span className="font-medium">{selectedContact.name}</span>
                            </div>
                          )}
                        </div>

                        {recentContacts.length > 0 && (
                          <div>
                            <Label className="text-sm text-gray-500">Recent Contacts</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {recentContacts.map((contact) => (
                                <Button
                                  key={contact.id}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => selectContact(contact)}
                                >
                                  <Avatar className="h-5 w-5 mr-2">
                                    <AvatarImage src={contact.avatar} />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {contact.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="contacts" className="space-y-4">
                        <div>
                          <Label htmlFor="search">Search Contacts</Label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              id="search"
                              placeholder="Search by name or address"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                              <div
                                key={contact.id}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectContact(contact)}
                              >
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3">
                                    <AvatarImage src={contact.avatar} />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{contact.name}</div>
                                    <div className="text-sm text-gray-500">{formatAddress(contact.address)}</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">No contacts found</div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div>
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Input
                        id="note"
                        placeholder="What's this for?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <Button className="w-full" onClick={handleContinue}>
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Transfer</CardTitle>
                    <CardDescription>Review the details before sending</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md space-y-4">
                      <div className="flex justify-between">
                        <div className="text-gray-500">Amount</div>
                        <div className="font-medium">${Number.parseFloat(amount).toFixed(2)}</div>
                      </div>

                      <div className="flex justify-between">
                        <div className="text-gray-500">Recipient</div>
                        <div className="font-medium">
                          {selectedContact ? (
                            <div className="flex items-center">
                              {selectedContact.name}
                              <Badge variant="outline" className="ml-2">
                                {formatAddress(selectedContact.address)}
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              {formatAddress(recipient)}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1"
                                onClick={() => copyToClipboard(recipient)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {note && (
                        <div className="flex justify-between">
                          <div className="text-gray-500">Note</div>
                          <div className="font-medium">{note}</div>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between">
                        <div className="text-gray-500">Network Fee</div>
                        <div className="font-medium">${estimatedFee.toFixed(3)}</div>
                      </div>

                      <div className="flex justify-between">
                        <div className="text-gray-500">Total</div>
                        <div className="font-bold">${totalAmount.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button className="flex-1" onClick={handleConfirm}>
                        Confirm & Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Transfer History</CardTitle>
                  <CardDescription>Your recent transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <Send className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Sent to Sarah</div>
                          <div className="text-sm text-gray-500">2 hours ago</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">-$50.00</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Received from Michael</div>
                          <div className="text-sm text-gray-500">Yesterday</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">+$25.00</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <Send className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Sent to Emma</div>
                          <div className="text-sm text-gray-500">3 days ago</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">-$75.00</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>

                    <Button variant="link" className="w-full flex items-center justify-center">
                      View all transfers <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Address Book</CardTitle>
                  <CardDescription>Manage your contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full flex items-center justify-center" variant="outline">
                      <Users className="mr-2 h-4 w-4" /> Manage Contacts
                    </Button>

                    <Button className="w-full flex items-center justify-center" variant="outline">
                      <User className="mr-2 h-4 w-4" /> Add New Contact
                    </Button>

                    <Button className="w-full flex items-center justify-center" variant="outline">
                      <Save className="mr-2 h-4 w-4" /> Save Current Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="receive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Receive Digital USD</CardTitle>
                  <CardDescription>Share your address to receive funds from anyone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center">
                    <div className="bg-white p-3 rounded-lg border mb-4">
                      {/* This would be a QR code in production */}
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-gray-400" />
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 mb-2">Your Digital USD Address</p>
                      <div className="flex items-center justify-center">
                        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                          0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-1"
                          onClick={() => copyToClipboard("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button variant="outline" className="flex items-center">
                        <Copy className="mr-2 h-4 w-4" /> Copy Address
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Save className="mr-2 h-4 w-4" /> Save as Image
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <ArrowRight className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">How to receive Digital USD</h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>Share your address or QR code with the sender</li>
                      <li>The sender will need to initiate the transfer from their wallet</li>
                      <li>Once sent, funds will appear in your account within minutes</li>
                      <li>You'll receive a notification when the transfer is complete</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deposits</CardTitle>
                  <CardDescription>Funds you've recently received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">From Michael</div>
                          <div className="text-sm text-gray-500">Yesterday</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">+$25.00</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">From David</div>
                          <div className="text-sm text-gray-500">Last week</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">+$100.00</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                    </div>

                    <Button variant="link" className="w-full flex items-center justify-center">
                      View all deposits <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

