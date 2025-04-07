"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { getTokenBalance } from "@/lib/blockchain/token-service"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenBalanceCardProps {
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  iconUrl?: string
}

export default function TokenBalanceCard({
  tokenAddress,
  tokenName,
  tokenSymbol,
  iconUrl = "/placeholder.svg?height=32&width=32",
}: TokenBalanceCardProps) {
  const { provider, address, connected } = useWallet()
  const [balance, setBalance] = useState<string>("0")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchBalance = async () => {
      if (provider && address && connected) {
        setLoading(true)
        try {
          const result = await getTokenBalance(provider, tokenAddress, address)
          setBalance(result.balance)
        } catch (error) {
          console.error(`Error fetching ${tokenSymbol} balance:`, error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchBalance()
  }, [provider, address, connected, tokenAddress, tokenSymbol])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img src={iconUrl || "/placeholder.svg"} alt={`${tokenName} icon`} className="w-8 h-8 rounded-full" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{tokenName}</div>
                {loading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <div className="text-lg font-semibold">${Number.parseFloat(balance).toFixed(2)}</div>
                )}
              </div>
              <div className={`w-3 h-3 rounded-full bg-blue-500`}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{tokenSymbol}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

