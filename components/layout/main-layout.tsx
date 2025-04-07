"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowRightLeft,
  Menu,
  X,
  BarChart2,
  User,
  SendHorizonal,
  Banknote,
  LogOut,
  Gift,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/blockchain/wallet-context"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useWallet()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/app/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "My Account",
      href: "/app/account",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Earn",
      href: "/app/earn",
      icon: <Banknote className="h-5 w-5" />,
    },
    {
      title: "Send & Receive",
      href: "/app/send",
      icon: <SendHorizonal className="h-5 w-5" />,
    },
    {
      title: "Trade",
      href: "/app/trade",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "Transactions",
      href: "/app/transactions",
      icon: <ArrowRightLeft className="h-5 w-5" />,
    },
    {
      title: "Rewards",
      href: "/app/rewards",
      icon: <Gift className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/app/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Amera</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href ||
                    (item.href === "/app/earn" && pathname?.startsWith("/app/earn")) ||
                    (item.href === "/app/send" && pathname?.startsWith("/app/send")) ||
                    (item.href === "/app/account" && pathname?.startsWith("/app/account")) ||
                    (item.href === "/app/rewards" && pathname?.startsWith("/app/rewards"))
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t p-3">
            <button
              onClick={() => {
                logout()
                window.location.href = "/"
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 lg:hidden">
          <div className="flex h-16 items-center gap-4 border-b bg-white px-4">
            <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/app/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Amera</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-6 max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default MainLayout

