"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SignupModal from "./signup-modal"

export default function CTA() {
  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-16 md:py-24 bg-blue-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Earning on Your Digital USD?
            </h2>
            <p className="max-w-[900px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join our thriving community—grow your wealth, secure your family's financial freedom, and take charge of
              your future today with Amera.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button
              size="xl"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-6"
              onClick={() => setIsModalOpen(true)}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-6">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Add the modal */}
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

