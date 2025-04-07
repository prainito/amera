"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Define supported chains
export const SUPPORTED_CHAINS = [
  { id: 1, name: "Ethereum", icon: "🔷" },
  { id: 8453, name: "Base", icon: "🔵" },
  { id: 1000001, name: "TRON", icon: "🔴" },
]

export default function ChainSelector() {
  const { chainId, switchChain, connected, connecting } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Find the current chain
  const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId) || SUPPORTED_CHAINS[0]

  if (!isClient || !connected) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 w-full">
          <span className="mr-1">{currentChain.icon}</span>
          <span className="flex-1 text-left">{currentChain.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {SUPPORTED_CHAINS.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => switchChain(chain.id)}
            disabled={connecting || chain.id === chainId}
          >
            <span className="flex items-center">
              <span className="mr-2">{chain.icon}</span>
              {chain.name}
            </span>
            {chain.id === chainId && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

