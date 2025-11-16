import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "eT's AI Builder - Build Your AI Future, Effortlessly",
  description:
    "Transform your ideas into beautiful interfaces instantly with multi-model AI support. Use Claude, Gemini, Mistral, and Perplexity models for free.",
  keywords: ["AI Builder", "UI Generator", "Next.js", "Puter", "Claude", "Gemini", "Mistral"],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js" />
      </body>
    </html>
  )
}
