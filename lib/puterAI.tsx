// Puter AI Integration with Keyless API Support
// Automatically detects Puter environment and uses free AI APIs

export interface AIModel {
  id: string
  name: string
  provider: string
  puterKey: string
}

export const availableModels: AIModel[] = [
  {
    id: "claude-sonnet-4-5",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    puterKey: "claude-sonnet-4",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    puterKey: "gemini-2.0-flash-exp",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    puterKey: "mistral-large-latest",
  },
  {
    id: "sonar-pro",
    name: "Sonar Pro",
    provider: "Perplexity AI",
    puterKey: "sonar-pro",
  },
]

// Check if running in Puter environment
export function isPuterEnvironment(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as any).puter
}

// Get Puter instance safely
function getPuter() {
  if (typeof window === "undefined") return null
  return (window as any).puter
}

// Generate UI code using Puter's AI API
export async function generateUIWithPuter(prompt: string, modelId = "claude-sonnet-4-5"): Promise<string> {
  const model = availableModels.find((m) => m.id === modelId)
  if (!model) {
    throw new Error(`Model ${modelId} not found`)
  }

  const puter = getPuter()

  if (!puter) {
    console.warn("[v0] Puter not available, using fallback mock generation")
    return generateFallbackUI(prompt)
  }

  try {
    console.log(`[v0] Generating UI with ${model.name} via Puter keyless API`)

    const systemPrompt = `You are an expert React/Next.js developer. Generate clean, modern, responsive React components using Tailwind CSS. 
Always return valid JSX code that can be rendered directly. Use TypeScript and follow best practices.
Include proper imports and export a default component.`

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate a complete React component:`

    // Use Puter AI chat with the specified model
    const response = await puter.ai.chat(fullPrompt, {
      model: model.puterKey,
      temperature: 0.7,
      stream: false,
    })

    let generatedCode = ""

    if (typeof response === "string") {
      generatedCode = response
    } else if (response?.message?.content) {
      generatedCode = response.message.content
    } else if (response?.content) {
      generatedCode = response.content
    } else {
      console.error("[v0] Unexpected response format:", response)
      throw new Error("Invalid response format from Puter AI")
    }

    // Clean up the code (remove markdown code blocks if present)
    generatedCode = generatedCode
      .replace(/```(?:jsx|tsx|javascript|typescript)?\n/g, "")
      .replace(/```\n?$/g, "")
      .trim()

    console.log("[v0] Successfully generated UI code")
    return generatedCode
  } catch (error) {
    console.error("[v0] Error generating UI with Puter:", error)
    throw new Error(`Failed to generate UI: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Fallback UI generator when Puter is not available
function generateFallbackUI(prompt: string): string {
  return `import React from 'react'

export default function GeneratedComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-4">
          ${escapeString(prompt)}
        </h1>
        <p className="text-gray-200 mb-6">
          This is a fallback component. For actual AI-generated UI, please ensure the Puter SDK is loaded.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-500/20 p-6 rounded-xl border border-purple-400/30">
            <h3 className="text-xl font-semibold text-purple-300 mb-2">Feature 1</h3>
            <p className="text-gray-300">Beautiful and responsive design</p>
          </div>
          <div className="bg-blue-500/20 p-6 rounded-xl border border-blue-400/30">
            <h3 className="text-xl font-semibold text-blue-300 mb-2">Feature 2</h3>
            <p className="text-gray-300">Modern and clean interface</p>
          </div>
          <div className="bg-indigo-500/20 p-6 rounded-xl border border-indigo-400/30">
            <h3 className="text-xl font-semibold text-indigo-300 mb-2">Feature 3</h3>
            <p className="text-gray-300">Fully customizable components</p>
          </div>
        </div>
        <button className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
          Get Started
        </button>
      </div>
    </div>
  )
}
`
}

// Helper to escape strings for JSX
function escapeString(str: string): string {
  return str.replace(/['"]/g, "").slice(0, 100)
}

// Deploy to Puter cloud
export async function deployToPuter(
  code: string,
  appName = "generated-ui",
): Promise<{ success: boolean; url?: string; error?: string }> {
  const puter = getPuter()

  if (!puter) {
    return {
      success: false,
      error: "Puter SDK not available. Please ensure the app is running on Puter.",
    }
  }

  try {
    console.log("[v0] Deploying to Puter Cloud...")

    // Create a simple HTML wrapper for the React component
    const htmlWrapper = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    ${code}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(GeneratedComponent));
  </script>
</body>
</html>
`

    // Use Puter's filesystem API to save and host the file
    const fileName = `${appName}-${Date.now()}.html`
    await puter.fs.write(fileName, htmlWrapper)

    const url = `https://puter.com/${fileName}`

    console.log("[v0] Successfully deployed to Puter Cloud:", url)

    return {
      success: true,
      url,
    }
  } catch (error) {
    console.error("[v0] Error deploying to Puter:", error)
    return {
      success: false,
      error: `Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
