"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import UnifiedAuth from "@/components/auth/unified-auth"

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <UnifiedAuth mode="signup" />
      </div>
    </div>
  )
}

