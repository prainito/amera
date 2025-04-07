"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { getTransactionHistory } from "@/lib/blockchain/token-service"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  type: "sent" | "received"
}

export default function TransactionHistory() {
  const { provider, address, connected, isMockWallet, chainId } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (connected && address) {
        setLoading(true)
        try {
          // Only use mock data if explicitly using a mock wallet
          const history = await getTransactionHistory(provider, address, isMockWallet, chainId)
          setTransactions(history)
        } catch (error) {
          console.error("Error fetching transaction history:", error)
          setTransactions([])
        } finally {
          setLoading(false)
        }
      } else {
        setTransactions([])
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [provider, address, connected, isMockWallet, chainId])

  const shortenAddress = (address: string) => {
    if (!address) return "Unknown"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const getExplorerUrl = (hash: string) => {
    // Default to Ethereum mainnet
    let baseUrl = "https://etherscan.io/tx/"

    // Change explorer URL based on chainId
    if (chainId === 8453) {
      baseUrl = "https://basescan.org/tx/"
    } else if (chainId === 1000001) {
      // TRON
      baseUrl = "https://tronscan.org/#/transaction/"
    } else if (chainId === 56) {
      baseUrl = "https://bscscan.com/tx/"
    }

    return `${baseUrl}${hash}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions {isMockWallet ? "(Mock Data)" : ""}</CardTitle>
        {transactions.length > 0 && !isMockWallet && (
          <Button variant="outline" size="sm" onClick={() => setTransactions([])}>
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            {connected ? "No transactions found" : "Connect your wallet to view transactions"}
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
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
                <div className="flex items-center">
                  <div className="text-right mr-3">
                    <div className={`font-medium ${tx.type === "sent" ? "text-red-500" : "text-green-500"}`}>
                      {tx.type === "sent" ? "-" : "+"}
                      {tx.value} {chainId === 1000001 ? "TRX" : "ETH"}
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(tx.timestamp)}</div>
                  </div>
                  {!isMockWallet && (
                    <a
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

