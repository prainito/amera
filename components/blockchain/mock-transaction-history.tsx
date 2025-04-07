"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    value: "0.5",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    type: "sent",
  },
  {
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0xB0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    to: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    value: "1.2",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    type: "received",
  },
  {
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    to: "0xC0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    value: "0.3",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    type: "sent",
  },
]

export default function MockTransactionHistory() {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions (Mock Data)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                {tx.type === "sent" ? (
                  <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-green-500 mr-2" />
                )}
                <div>
                  <div className="font-medium">{tx.type === "sent" ? "Sent to" : "Received from"}</div>
                  <div className="text-sm text-gray-500">
                    {tx.type === "sent" ? shortenAddress(tx.to) : shortenAddress(tx.from)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${tx.type === "sent" ? "text-red-500" : "text-green-500"}`}>
                  {tx.type === "sent" ? "-" : "+"}
                  {tx.value} ETH
                </div>
                <div className="text-xs text-gray-500">{formatDate(tx.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

