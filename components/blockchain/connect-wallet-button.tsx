"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/lib/blockchain/wallet-context"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Copy, Check, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SUPPORTED_CHAINS } from "./chain-selector"
import { cn } from "@/lib/utils"

export default function ConnectWalletButton({ className }: { className?: string }) {
  const {
    connectWallet,
    disconnectWallet,
    address,
    balance,
    connecting,
    connected,
    isMockWallet,
    chainId,
    isAuthenticated,
  } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = () => {
    if (address && isClient) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const viewOnExplorer = () => {
    if (address && isClient) {
      // Get the appropriate explorer URL based on the chain
      let explorerUrl = "https://etherscan.io/address/"

      if (chainId === 8453) {
        explorerUrl = "https://basescan.org/address/"
      } else if (chainId === 1000001) {
        explorerUrl = "https://tronscan.org/#/address/"
      }

      window.open(`${explorerUrl}${address}`, "_blank")
    }
  }

  // Get chain name
  const getChainName = (chainId: number | null) => {
    if (!chainId) return ""

    const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId)
    return chain ? chain.name : `Chain ${chainId}`
  }

  if (!connected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={connecting}
        variant="outline"
        className={cn("min-w-[150px]", className)}
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
    )
  }

  // Update the button to show chain name
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("min-w-[150px]", className)}>
          {address ? shortenAddress(address) : "Connected"}
          {chainId && !isMockWallet && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
              {getChainName(chainId)}
            </span>
          )}
          {isMockWallet && " (Mock)"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>
          Wallet {isMockWallet ? "(Mock)" : chainId ? `on ${getChainName(chainId)}` : ""}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="flex justify-between">
          <span>Balance:</span>
          <span>
            {Number.parseFloat(balance).toFixed(4)} {chainId === 1000001 ? "TRX" : "ETH"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyAddress}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </>
          )}
        </DropdownMenuItem>
        {!isMockWallet && (
          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

