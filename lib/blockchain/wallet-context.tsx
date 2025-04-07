"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for ethers v6
type Provider = any
type Signer = any

// Update the WalletContextType to include the new fields
type WalletContextType = {
  address: string | null
  balance: string
  chainId: number | null
  connecting: boolean
  connected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  provider: Provider | null
  signer: Signer | null
  isMockWallet: boolean
  switchChain: (chainId: number) => Promise<void>
  // Account integration fields
  isAuthenticated: boolean
  userEmail: string | null
  userName: string | null
  encryptedPrivateKey: string | null
  setUserInfo: (email: string, name: string, address?: string, encryptedKey?: string) => void
  logout: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: "0",
  chainId: null,
  connecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  provider: null,
  signer: null,
  isMockWallet: false,
  switchChain: async () => {},
  // Default values for new fields
  isAuthenticated: false,
  userEmail: null,
  userName: null,
  encryptedPrivateKey: null,
  setUserInfo: () => {},
  logout: () => {},
})

export const useWallet = () => useContext(WalletContext)

type WalletProviderProps = {
  children: ReactNode
}

// Chain configuration for adding to MetaMask
const CHAIN_CONFIG = {
  1: {
    chainId: "0x1", // Ethereum Mainnet
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  8453: {
    chainId: "0x2105", // Base Mainnet
    chainName: "Base Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
  },
  1000001: {
    // Custom ID for TRON (not a real EVM chainId)
    chainId: "0xF4241", // Hex representation of 1000001
    chainName: "TRON Network",
    nativeCurrency: {
      name: "TRON",
      symbol: "TRX",
      decimals: 6,
    },
    rpcUrls: ["https://api.trongrid.io"],
    blockExplorerUrls: ["https://tronscan.org"],
  },
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [isMockWallet, setIsMockWallet] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)

  // New state for user account integration
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  // In the WalletProvider component, add the new state
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState<string | null>(null)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in from localStorage
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail")
      const storedName = localStorage.getItem("userName")
      if (storedEmail) {
        setUserEmail(storedEmail)
        setUserName(storedName)
        setIsAuthenticated(true)
      }
    }
  }, [])

  // This effect checks if wallet is already connected
  useEffect(() => {
    if (isClient) {
      checkConnection()

      // Listen for account changes
      const ethereum = window.ethereum
      if (ethereum) {
        ethereum.on("accountsChanged", handleAccountsChanged)
        ethereum.on("chainChanged", handleChainChanged)

        return () => {
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [isClient])

  // Check if wallet is already connected
  const checkConnection = async () => {
    if (!isClient) return

    // Check if ethereum is available
    if (!window.ethereum) {
      console.log("No wallet detected. Please install MetaMask or another wallet provider.")
      return
    }

    try {
      // Use dynamic import for ethers to avoid SSR issues
      const { ethers } = await import("ethers")

      // Create provider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await ethersProvider.listAccounts()

      if (accounts.length > 0) {
        const ethersSigner = await ethersProvider.getSigner()
        const address = await ethersSigner.getAddress()
        const balanceWei = await ethersProvider.getBalance(address)
        const balance = ethers.formatEther(balanceWei)
        const network = await ethersProvider.getNetwork()
        const chainId = Number(network.chainId)

        setProvider(ethersProvider)
        setSigner(ethersSigner)
        setAddress(address)
        setBalance(balance)
        setChainId(chainId)
        setConnected(true)

        // If wallet is connected, consider the user authenticated
        setIsAuthenticated(true)

        // Store wallet address as username for wallet-based authentication
        if (!userEmail) {
          setUserName(`Wallet User (${address.substring(0, 6)}...${address.substring(address.length - 4)})`)
        }
      }
    } catch (error) {
      console.error("Failed to check wallet connection:", error)
    }
  }

  // Add TRON chain handling in the connectWallet function
  const connectWallet = async () => {
    if (!isClient) return

    if (!window.ethereum) {
      // Use mock wallet instead
      setIsMockWallet(true)
      setAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
      setBalance("1.5")
      setChainId(1) // Default to Ethereum
      setConnected(true)
      setIsAuthenticated(true)
      return
    }

    setConnecting(true)

    try {
      // Use dynamic import for ethers
      const { ethers } = await import("ethers")

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      const ethersSigner = await ethersProvider.getSigner()
      const address = await ethersSigner.getAddress()
      const balanceWei = await ethersProvider.getBalance(address)
      const balance = ethers.formatEther(balanceWei)
      const network = await ethersProvider.getNetwork()
      const chainId = Number(network.chainId)

      // Check if we're on a supported chain
      const supportedChains = [1, 8453, 1000001] // ETH, BASE, TRON
      if (!supportedChains.includes(chainId)) {
        console.warn(`Connected to chain ID ${chainId}, which may not be fully supported.`)
      }

      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setAddress(address)
      setBalance(balance)
      setChainId(chainId)
      setConnected(true)
      setIsAuthenticated(true)

      // Store wallet address as username for wallet-based authentication
      if (!userEmail) {
        setUserName(`Wallet User (${address.substring(0, 6)}...${address.substring(address.length - 4)})`)
      }

      console.log("Wallet connected successfully:", address)
    } catch (error) {
      console.error("Failed to connect wallet:", error)

      // Use mock wallet as fallback
      setIsMockWallet(true)
      setAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
      setBalance("1.5")
      setChainId(1)
      setConnected(true)
      setIsAuthenticated(true)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setBalance("0")
    setChainId(null)
    setConnected(false)
    setProvider(null)
    setSigner(null)
    setIsMockWallet(false)

    // Only clear wallet authentication if the user isn't logged in with email
    if (!userEmail) {
      setIsAuthenticated(false)
      setUserName(null)
    }
  }

  // Set user info for email-based authentication
  // Update the setUserInfo function to handle the wallet info
  const setUserInfo = (email: string, name: string, address?: string, encryptedKey?: string) => {
    setUserEmail(email)
    setUserName(name)
    setIsAuthenticated(true)

    // If address and encryptedKey are provided, update the wallet info
    if (address) {
      setAddress(address)
      setConnected(true)
    }

    if (encryptedKey) {
      setEncryptedPrivateKey(encryptedKey)
    }

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", name)
      if (address) localStorage.setItem("userAddress", address)
      if (encryptedKey) localStorage.setItem("encryptedPrivateKey", encryptedKey)
    }
  }

  // Logout function for both wallet and email authentication
  // Update the logout function to clear the wallet info
  const logout = () => {
    disconnectWallet()
    setUserEmail(null)
    setUserName(null)
    setIsAuthenticated(false)
    setEncryptedPrivateKey(null)

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("userAddress")
      localStorage.removeItem("encryptedPrivateKey")
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet()
    } else {
      // User switched accounts, need to refresh data
      checkConnection()
    }
  }

  const handleChainChanged = () => {
    // Chain changed, we need to reload the app
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  // Function to switch chains
  const switchChain = async (newChainId: number) => {
    if (!window.ethereum || isMockWallet) {
      // For mock wallet, just update the state
      if (isMockWallet) {
        setChainId(newChainId)
      }
      return
    }

    setConnecting(true)

    try {
      // Try to switch to the chain
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${newChainId.toString(16)}` }],
      })

      // The chain changed event will trigger a reload
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          const config = CHAIN_CONFIG[newChainId as keyof typeof CHAIN_CONFIG]
          if (!config) {
            throw new Error(`Chain configuration not found for chainId: ${newChainId}`)
          }

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [config],
          })

          // Try switching again after adding
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: config.chainId }],
          })
        } catch (addError) {
          console.error("Error adding chain:", addError)
        }
      } else {
        console.error("Error switching chain:", switchError)
      }
    } finally {
      setConnecting(false)
    }
  }

  // Update the return value of the context provider
  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        connecting,
        connected,
        connectWallet,
        disconnectWallet,
        provider,
        signer,
        isMockWallet,
        switchChain,
        isAuthenticated,
        userEmail,
        userName,
        encryptedPrivateKey,
        setUserInfo,
        logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

