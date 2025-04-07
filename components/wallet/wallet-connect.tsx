"use client"

import { Button } from "@/components/ui/button"

import { useWallet } from "@/lib/blockchain/wallet-context"
import ConnectWalletButton from "@/components/blockchain/connect-wallet-button"

export function WalletConnect() {
  const { isAuthenticated, userEmail, userName, logout } = useWallet()

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex flex-col items-start">
          <div className="text-sm font-medium">{userName || userEmail}</div>
          <Button variant="link" size="sm" onClick={logout} className="p-0">
            Log Out
          </Button>
        </div>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  )
}

