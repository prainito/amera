import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import InterestCalculator from "@/components/interest-calculator"
import NoFees from "@/components/no-fees"
import HowItWorks from "@/components/how-it-works"
import InterestRates from "@/components/interest-rates"
import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <InterestCalculator />
      <NoFees />
      <HowItWorks />
      <InterestRates />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

