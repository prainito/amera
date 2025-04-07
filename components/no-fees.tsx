import { Ban, Check } from "lucide-react"

export default function NoFees() {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-6 mb-6">
            <Ban className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            No Hidden Fees. <span className="text-green-600">Period.</span>
          </h2>

          <p className="text-xl text-gray-600 mb-10">
            We help you grow your wealth by giving you the best rates in market. We're not here to take your money,
            we're here to make you money.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cost-Effective Rates</h3>
              <p className="text-gray-500 text-center">Institutional partnerships for unbeatable rates</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Earnings</h3>
              <p className="text-gray-500 text-center">See exactly how much you’re earning—no surprises, just growth</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No default fees</h3>
              <p className="text-gray-500 text-center">No hidden charges or surprise costs</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-100">
            <p className="text-left text-lg text-green-700 mt-4">
              We only make money when you make money — by taking a small percentage of the interest you earn.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

