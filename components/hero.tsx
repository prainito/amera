"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SignupModal from "./signup-modal"
import Link from "next/link"

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none leading-tight">
                Hold, Save & Earn up to 8% Interest with Digital USD
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Convert your cash into Digital USD instantly. Earn up to 8% interest and beat inflation with Amera.
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-3">
              <Button
                size="xl"
                className="bg-blue-600 hover:bg-blue-700 text-lg py-6"
                onClick={() => setIsModalOpen(true)}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" className="text-lg py-6">
                <Link href="/login" className="flex items-center justify-center w-full h-full">
                  Log In
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-[60px] opacity-20"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <span className="font-semibold text-lg">Amera</span>
                    </div>
                    <div className="text-sm text-gray-500">Digital USD</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Current Balance</div>
                      <div className="text-2xl font-bold">$10,000.00</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Interest Earned</div>
                      <div className="text-xl font-semibold text-green-600">+$67.12 this month</div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">Annual Interest Rate</div>
                        <div className="text-lg font-semibold text-blue-600">8.0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

