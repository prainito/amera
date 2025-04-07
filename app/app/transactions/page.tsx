"use client"

import { useState } from "react"
import { ArrowDownUp, ArrowUpRight, ArrowDownLeft, Filter, Download, Search } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    type: "send",
    amount: "250.00",
    currency: "USDA",
    recipient: "0x1a2...3b4c",
    date: new Date(2023, 10, 15, 14, 30),
    status: "completed",
    fee: "0.50",
  },
  {
    id: "tx2",
    type: "receive",
    amount: "1,000.00",
    currency: "USDA",
    sender: "0x5d6...7e8f",
    date: new Date(2023, 10, 14, 9, 45),
    status: "completed",
    fee: "0.00",
  },
  {
    id: "tx3",
    type: "deposit",
    amount: "500.00",
    currency: "USDA",
    vault: "Amera Safe Vault",
    date: new Date(2023, 10, 12, 16, 20),
    status: "completed",
    fee: "0.00",
  },
  {
    id: "tx4",
    type: "withdraw",
    amount: "100.00",
    currency: "USDA",
    vault: "Amera Growth Vault",
    date: new Date(2023, 10, 10, 11, 15),
    status: "completed",
    fee: "0.00",
  },
  {
    id: "tx5",
    type: "trade",
    amount: "200.00",
    fromCurrency: "USD",
    toCurrency: "USDA",
    date: new Date(2023, 10, 8, 13, 50),
    status: "completed",
    fee: "1.00",
  },
  {
    id: "tx6",
    type: "send",
    amount: "75.00",
    currency: "USDA",
    recipient: "0x9g0...1h2i",
    date: new Date(2023, 10, 5, 10, 25),
    status: "pending",
    fee: "0.50",
  },
]

// Transaction type icons
const typeIcons = {
  send: <ArrowUpRight className="h-4 w-4 text-red-500" />,
  receive: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
  deposit: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
  withdraw: <ArrowUpRight className="h-4 w-4 text-red-500" />,
  trade: <ArrowDownUp className="h-4 w-4 text-blue-500" />,
}

// Transaction type labels
const typeLabels = {
  send: "Sent",
  receive: "Received",
  deposit: "Deposited",
  withdraw: "Withdrawn",
  trade: "Traded",
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  // Filter transactions based on search query and selected tab
  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      searchQuery === "" ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.recipient && tx.recipient.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.sender && tx.sender.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.vault && tx.vault.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "transfers" && (tx.type === "send" || tx.type === "receive")) ||
      (selectedTab === "vaults" && (tx.type === "deposit" || tx.type === "withdraw")) ||
      (selectedTab === "trades" && tx.type === "trade")

    return matchesSearch && matchesTab
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-gray-500">View and manage all your transaction history in one place</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Time</DropdownMenuItem>
              <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="flex gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="vaults">Vaults</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Details</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-gray-100 p-2">{typeIcons[tx.type]}</div>
                          <span>{typeLabels[tx.type]}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">
                          {tx.type === "send" || tx.type === "withdraw" ? "-" : "+"}${tx.amount}
                        </div>
                        <div className="text-sm text-gray-500">{tx.currency}</div>
                      </td>
                      <td className="py-4">
                        {tx.type === "send" && (
                          <div>
                            <div className="text-sm text-gray-500">To</div>
                            <div className="font-mono text-sm">{tx.recipient}</div>
                          </div>
                        )}
                        {tx.type === "receive" && (
                          <div>
                            <div className="text-sm text-gray-500">From</div>
                            <div className="font-mono text-sm">{tx.sender}</div>
                          </div>
                        )}
                        {(tx.type === "deposit" || tx.type === "withdraw") && (
                          <div>
                            <div className="text-sm text-gray-500">Vault</div>
                            <div className="text-sm">{tx.vault}</div>
                          </div>
                        )}
                        {tx.type === "trade" && (
                          <div>
                            <div className="text-sm text-gray-500">Exchange</div>
                            <div className="text-sm">
                              {tx.fromCurrency} → {tx.toCurrency}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <div>{format(tx.date, "MMM d, yyyy")}</div>
                        <div className="text-sm text-gray-500">{format(tx.date, "h:mm a")}</div>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={tx.status === "completed" ? "outline" : "secondary"}
                          className={tx.status === "completed" ? "bg-green-50 text-green-700 hover:bg-green-50" : ""}
                        >
                          {tx.status === "completed" ? "Completed" : "Pending"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

