import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your Amera account in minutes with just an email and password.",
    },
    {
      number: "02",
      title: "Deposit Funds",
      description: "Add funds via credit card, Apple Pay, or bank transfer to convert to Digital USD.",
    },
    {
      number: "03",
      title: "Start Earning",
      description:
        "Your funds instantly earn interest by powering liquidity for institutional investors, unlocking premium Wall Street-level rates.",
    },
    {
      number: "04",
      title: "Flexible Withdrawals",
      description: "Enjoy immediate access to your funds, or choose lockup periods to boost your earnings.",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 text-center">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Process</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
              Getting started with Amera is simple and straightforward.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center sm:items-start space-y-3 text-center sm:text-left"
            >
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-10 hidden h-0.5 w-[calc(100%-20px)] bg-blue-200 lg:block"></div>
              )}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900 font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link
            href="/blog/how-amera-digital-usd-works"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

