import { DollarSign, TrendingUp, Lock, Globe, Zap, Coins } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-blue-600" />,
      title: "Up to 8% interest",
      description: "Earn more on your USD, instead of watching it lose value in a bank.",
    },
    {
      icon: <DollarSign className="h-10 w-10 text-blue-600" />,
      title: "Hedge against inflation",
      description: "Protect your wealth by keeping it in USD, not a devaluing local currency.",
    },
    {
      icon: <Lock className="h-10 w-10 text-blue-600" />,
      title: "Withdraw Anytime",
      description: "Full control of your funds, accessible anytime.",
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-600" />,
      title: "Global coverage",
      description: "On and off ramp your funds cost-effectively in over 180 countries.",
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-600" />,
      title: "Instant conversion",
      description: "Convert your cash into Digital USD (USDC) using credit card, Apple Pay, or bank transfer.",
    },
    {
      icon: <Coins className="h-10 w-10 text-blue-600" />,
      title: "Earn on crypto assets",
      description: "Earn interest on top crypto assets like Bitcoin, Ethereum, Solana, and more.",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 text-center">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              Why Choose Amera?
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
              Amera gives you the power of USD with better returns and complete control.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center sm:items-start space-y-3 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center sm:text-left"
            >
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

