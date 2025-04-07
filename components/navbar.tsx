"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SignupModal from "./signup-modal"
import { smoothScrollTo } from "@/lib/scroll-utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    smoothScrollTo(sectionId)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-semibold text-lg">Amera</span>
          </div>
          <div className="hidden md:block ml-4 pl-4 border-l text-gray-500 italic text-sm">
            Financial freedom starts today
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="block md:hidden z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button
            variant="link"
            size="lg"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => scrollToSection("features")}
          >
            Features
          </Button>
          <Button
            variant="link"
            size="lg"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </Button>
          <Button
            variant="link"
            size="lg"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => scrollToSection("interest-rates")}
          >
            Interest Rates
          </Button>
          <div className="flex items-center space-x-3 ml-2">
            <Button variant="outline" size="lg" href="/login">
              Log In
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsSignupModalOpen(true)}>
              Sign Up
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white">
            <div className="flex flex-col h-full p-4 pt-16">
              <div className="flex items-center justify-between absolute top-0 left-0 right-0 p-4 border-b bg-white">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <span className="font-semibold text-lg">Amera</span>
                </div>
              </div>

              <nav className="flex-1 mt-4">
                <ul className="space-y-4">
                  {["features", "how-it-works", "interest-rates"].map((section) => (
                    <li key={section}>
                      <Button
                        variant="link"
                        className="justify-start text-gray-600 hover:text-blue-600 w-full"
                        onClick={() => scrollToSection(section)}
                      >
                        {section
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Button>
                    </li>
                  ))}
                  <li className="pt-4 border-t border-gray-100 mt-4">
                    <Link href="/login" className="block w-full">
                      <Button variant="outline" size="lg" className="w-full mb-3">
                        Log In
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsSignupModalOpen(true)
                      }}
                    >
                      Sign Up
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </header>
  )
}

