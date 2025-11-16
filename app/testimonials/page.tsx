import Header from "@/components/Header"
import TestimonialsSection from "@/components/TestimonialsSection"
import Footer from "@/components/Footer"
import ParticlesBackground from "@/components/ParticlesBackground"

export const metadata = {
  title: "Testimonials - eT's AI Builder",
  description: "See what our users are saying about eT's AI Builder",
}

export default function TestimonialsPage() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            What Our Users Say
          </h1>
          <p className="text-xl text-gray-400 font-inter max-w-3xl mx-auto">
            Join thousands of developers building with AI
          </p>
        </div>
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
