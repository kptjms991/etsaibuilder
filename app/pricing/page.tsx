import Header from "@/components/Header"
import PricingSection from "@/components/PricingSection"
import Footer from "@/components/Footer"
import ParticlesBackground from "@/components/ParticlesBackground"

export const metadata = {
  title: "Pricing - eT's AI Builder",
  description: "Choose a plan that fits your needs. Scale up as your AI projects grow.",
}

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Flexible Pricing
          </h1>
          <p className="text-xl text-gray-400 font-inter max-w-3xl mx-auto">
            Choose a plan that fits your needs. Scale up as your AI projects grow.
          </p>
        </div>
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
