/**
 * Wallet service for creating and managing wallets
 * This service handles the creation of wallets for users and the encryption/decryption of private keys
 */

// Create a new wallet for a user
export async function createWalletForUser(): Promise<{ address: string; privateKey: string }> {
  try {
    // Use dynamic import for ethers to avoid SSR issues
    const { ethers } = await import("ethers")

    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom()

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    }
  } catch (error) {
    console.error("Error creating wallet:", error)
    throw new Error("Failed to create wallet")
  }
}

// Encrypt a private key with a password
export async function encryptPrivateKey(privateKey: string, password: string): Promise<string> {
  try {
    const { ethers } = await import("ethers")

    // Create a wallet from the private key
    const wallet = new ethers.Wallet(privateKey)

    // Encrypt the wallet with the password
    const encryptedJson = await wallet.encrypt(password)

    return encryptedJson
  } catch (error) {
    console.error("Error encrypting private key:", error)
    throw new Error("Failed to encrypt private key")
  }
}

// Decrypt a private key with a password
export async function decryptPrivateKey(encryptedJson: string, password: string): Promise<string> {
  try {
    const { ethers } = await import("ethers")

    // Decrypt the wallet with the password
    const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password)

    return wallet.privateKey
  } catch (error) {
    console.error("Error decrypting private key:", error)
    throw new Error("Failed to decrypt private key")
  }
}

// Export wallet as JSON keystore file (compatible with most wallets)
export async function exportWalletAsKeystore(privateKey: string, password: string): Promise<string> {
  return await encryptPrivateKey(privateKey, password)
}

// Export wallet as private key (plaintext)
export function exportWalletAsPrivateKey(privateKey: string): string {
  return privateKey
}

// Export wallet as mnemonic phrase (if available)
export async function exportWalletAsMnemonic(privateKey: string): Promise<string | null> {
  try {
    const { ethers } = await import("ethers")

    // Create a wallet from the private key
    const wallet = new ethers.Wallet(privateKey)

    // Not all wallets have a mnemonic
    if (!wallet.mnemonic) {
      return null
    }

    return wallet.mnemonic.phrase
  } catch (error) {
    console.error("Error exporting mnemonic:", error)
    return null
  }
}

