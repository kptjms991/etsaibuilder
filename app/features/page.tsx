import Header from "@/components/Header"
import FeatureCardsSection from "@/components/FeatureCardsSection"
import Footer from "@/components/Footer"
import ParticlesBackground from "@/components/ParticlesBackground"

export const metadata = {
  title: "Features - eT's AI Builder",
  description: "Explore powerful AI-driven features for building stunning UIs",
}

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-400 font-inter max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale AI-powered applications
          </p>
        </div>
        <FeatureCardsSection />
      </main>
      <Footer />
    </div>
  )
}
