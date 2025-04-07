"use client"

import { useState, useCallback } from "react"
import { BanxaOnrampModal } from "@/components/onramp/banxa-onramp-modal"

interface BanxaOnrampOptions {
  fiatAmount?: number
  fiatCurrency?: string
  cryptoCurrency?: string
  direction?: "buy" | "sell"
}

export function useBanxaOnramp() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<BanxaOnrampOptions>({})

  const openBanxaOnramp = useCallback((opts: BanxaOnrampOptions = {}) => {
    setOptions(opts)
    setIsOpen(true)
  }, [])

  const closeBanxaOnramp = useCallback(() => {
    setIsOpen(false)
  }, [])

  const BanxaModal = useCallback(() => {
    return (
      <BanxaOnrampModal
        isOpen={isOpen}
        onClose={closeBanxaOnramp}
        fiatAmount={options.fiatAmount}
        fiatCurrency={options.fiatCurrency}
        cryptoCurrency={options.cryptoCurrency}
        direction={options.direction}
      />
    )
  }, [isOpen, closeBanxaOnramp, options])

  return {
    openBanxaOnramp,
    closeBanxaOnramp,
    BanxaModal,
  }
}

