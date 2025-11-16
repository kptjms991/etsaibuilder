import Header from "@/components/Header"
import AIBuilderPage from "@/components/AIBuilderPage"
import Footer from "@/components/Footer"
import ParticlesBackground from "@/components/ParticlesBackground"

export const metadata = {
  title: "AI Builder - eT's AI Builder",
  description: "Generate beautiful UIs with AI - powered by Claude, Gemini, Mistral, and Perplexity",
}

export default function BuilderPage() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Header />
      <main className="container mx-auto px-4 py-20">
        <AIBuilderPage />
      </main>
      <Footer />
    </div>
  )
}
