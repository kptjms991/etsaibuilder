import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeatureCardsSection from "@/components/FeatureCardsSection"
import PricingSection from "@/components/PricingSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import Footer from "@/components/Footer"
import ParticlesBackground from "@/components/ParticlesBackground"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Header />
      <main>
        <HeroSection />
        <FeatureCardsSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
