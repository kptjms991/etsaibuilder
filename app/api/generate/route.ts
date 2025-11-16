import { type NextRequest, NextResponse } from "next/server"

// AIMLAPI.com Configuration
const AIMLAPI_CONFIG = {
  baseURL: "https://api.aimlapi.com/v1",
  endpoints: {
    chat: "/chat/completions",
    models: "/models"
  }
}

// Vibe Coding System Prompt
const SYSTEM_PROMPT = `You are eT's AI - an expert full-stack developer specializing in modern web technologies.

TECH STACK: React, Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui, Prisma, tRPC

VIBE CODING RULES:
1. Generate COMPLETE, PRODUCTION-READY full-stack applications
2. Include both FRONTEND and BACKEND code
3. Generate multiple files: components, API routes, database schemas, utilities
4. Use TypeScript for complete type safety
5. Implement responsive design with Tailwind CSS
6. Include proper error handling and accessibility
7. Use modern React patterns (hooks, server components, server actions)
8. Add realistic mock data and loading states
9. Include smooth animations with Framer Motion
10. Make it mobile-first and performant
11. Generate API routes with proper validation
12. Include database models and migrations
13. Add authentication setup when needed
14. Create utility functions and helpers
15. Include environment variable templates

DARK PURPLE THEME:
- Background: #0a0a0f to #1a1a2e gradient
- Primary: #a855f7 (purple-500)
- Accent: #9333ea (purple-600)
- Cards: #1a1a2e with purple glow borders
- Text: white to purple-200
- Use glass morphism effects

FULL-STACK STRUCTURE:
For each request, generate:
1. Frontend pages and components with the dark purple theme
2. API Routes (app/api/**/route.ts)
3. Database Schema (prisma/schema.prisma if needed)
4. Server Actions (app/actions/*.ts if needed)
5. Utility Functions (lib/*.ts)
6. Type Definitions (types/*.ts)
7. Configuration Files (.env.example, next.config.js if needed)

Format your response as JSON with this structure:
{
  "files": [
    { "path": "app/page.tsx", "content": "...", "language": "typescript" },
    { "path": "app/api/users/route.ts", "content": "...", "language": "typescript" }
  ],
  "description": "Brief description of what was generated",
  "setupInstructions": "Step-by-step setup instructions"
}

Always return clean, well-structured code that can be directly used in production.`

// Track API usage in memory (in production, use a database)
const usageTracker = {
  requests: 0,
  tokens: 0,
  limit: 100,
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, context, files } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.AIMLAPI_KEY

    if (!apiKey) {
      // Fallback generation when no API key is configured
      return NextResponse.json({
        code: generateFallbackComponent(prompt),
        model: "fallback",
        usage: null,
        files: generateProjectFiles(prompt)
      })
    }

    // Generate with AIMLAPI
    const result = await generateWithAIMLAPI(apiKey, prompt, model, context)

    return NextResponse.json({
      code: result.code,
      model: model || "gpt-4",
      usage: result.usage,
      files: result.files
    })
  } catch (error) {
    console.error("[v0] Error in generate route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate component",
        code: generateFallbackComponent(""),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    usage: usageTracker,
  })
}

async function generateWithAIMLAPI(
  apiKey: string,
  prompt: string,
  model = "gpt-4",
  context?: any
) {
  const enhancedPrompt = `Generate a COMPLETE full-stack Next.js 14 application for: ${prompt}

REQUIREMENTS:
1. Return ONLY valid JSON in this exact format - no markdown, no extra text:
{
  "files": [
    { "path": "app/page.tsx", "content": "...", "language": "typescript" },
    { "path": "app/api/example/route.ts", "content": "...", "language": "typescript" }
  ],
  "description": "Brief description",
  "setupInstructions": "Setup steps"
}

2. Use the DARK PURPLE THEME in all frontend code:
   - Background: bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]
   - Cards: bg-purple-500/10 border border-purple-500/30
   - Buttons: bg-gradient-to-r from-purple-600 to-pink-600
   - Text: text-purple-100, text-purple-300

3. Generate PRODUCTION-READY code with:
   - TypeScript strict mode
   - Proper error handling
   - Accessibility features
   - Responsive design (mobile-first)
   - Loading states
   - Framer Motion animations

4. Include backend if needed:
   - API routes for data operations
   - Database schema (Prisma) if data persistence needed
   - Server actions for forms
   - Proper validation and error responses

${context ? `\n\nContext from previous messages: ${JSON.stringify(context.slice(-3))}` : ''}

IMPORTANT: Return ONLY the JSON object, nothing else.`

  const response = await fetch(`${AIMLAPI_CONFIG.baseURL}${AIMLAPI_CONFIG.endpoints.chat}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: enhancedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  })

  if (!response.ok) {
    console.error("[v0] AIMLAPI error:", await response.text())
    throw new Error("AIMLAPI request failed")
  }

  const data = await response.json()

  usageTracker.requests++
  usageTracker.tokens += data.usage?.total_tokens || 0

  const generatedContent = data.choices[0]?.message?.content || ""

  let parsedFiles
  let mainCode = ""
  
  try {
    // Try to extract JSON from the response
    const jsonMatch = generatedContent.match(/\{[\s\S]*"files"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      parsedFiles = parsed.files
      mainCode = parsedFiles.find((f: any) => f.path.includes('page.tsx'))?.content || parsedFiles[0]?.content || ""
    } else {
      // Fallback: extract code blocks and structure them
      const codeBlocks = extractCodeBlocks(generatedContent)
      parsedFiles = generateProjectFiles(prompt, codeBlocks[0] || "")
      mainCode = codeBlocks[0] || generateFallbackComponent(prompt)
    }
  } catch (e) {
    console.error("[v0] JSON parse error:", e)
    const codeBlocks = extractCodeBlocks(generatedContent)
    parsedFiles = generateProjectFiles(prompt, codeBlocks[0] || "")
    mainCode = codeBlocks[0] || generateFallbackComponent(prompt)
  }

  return {
    code: mainCode,
    usage: {
      provider: "AIMLAPI",
      requests: usageTracker.requests,
      limit: usageTracker.limit,
      tokensUsed: data.usage?.total_tokens || 0,
    },
    files: parsedFiles
  }
}

function extractCodeBlocks(text: string): string[] {
  const codeBlockRegex = /\`\`\`(?:jsx?|tsx?|typescript|javascript)?\n([\s\S]+?)\n\`\`\`/g
  const matches = []
  let match
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    matches.push(match[1])
  }
  
  return matches
}

function generateProjectFiles(prompt: string, code?: string) {
  const componentName = prompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('').replace(/[^a-zA-Z]/g, '') || 'App'
  const hasDatabase = prompt.toLowerCase().includes('database') || prompt.toLowerCase().includes('data') || prompt.toLowerCase().includes('user')
  const hasAuth = prompt.toLowerCase().includes('auth') || prompt.toLowerCase().includes('login') || prompt.toLowerCase().includes('signup')
  
  const files = [
    {
      path: `app/page.tsx`,
      content: code || generateFallbackComponent(prompt),
      language: 'typescript'
    },
    {
      path: `app/api/${componentName.toLowerCase()}/route.ts`,
      content: generateAPIRoute(componentName, hasDatabase),
      language: 'typescript'
    },
    {
      path: 'lib/utils.ts',
      content: generateUtils(),
      language: 'typescript'
    },
    {
      path: 'types/index.ts',
      content: generateTypes(componentName),
      language: 'typescript'
    }
  ]

  if (hasDatabase) {
    files.push({
      path: 'prisma/schema.prisma',
      content: generatePrismaSchema(componentName, hasAuth),
      language: 'prisma'
    })
  }

  if (hasAuth) {
    files.push({
      path: 'app/actions/auth.ts',
      content: generateAuthActions(),
      language: 'typescript'
    })
  }

  files.push({
    path: '.env.example',
    content: generateEnvExample(hasDatabase, hasAuth),
    language: 'text'
  })

  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: componentName.toLowerCase(),
      version: '1.0.0',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        'prisma:generate': 'prisma generate',
        'prisma:push': 'prisma db push'
      },
      dependencies: {
        'react': '^18.2.0',
        'next': '^14.0.0',
        'framer-motion': '^10.0.0',
        'lucide-react': '^0.294.0',
        ...(hasDatabase ? { '@prisma/client': '^5.0.0' } : {}),
        ...(hasAuth ? { 'next-auth': '^4.24.0' } : {})
      },
      devDependencies: {
        'typescript': '^5.0.0',
        '@types/react': '^18.2.0',
        '@types/node': '^20.0.0',
        ...(hasDatabase ? { 'prisma': '^5.0.0' } : {})
      }
    }, null, 2),
    language: 'json'
  })

  return files
}

function generateAPIRoute(name: string, hasDatabase: boolean): string {
  return `import { NextRequest, NextResponse } from 'next/server'
${hasDatabase ? "import { prisma } from '@/lib/prisma'\n" : ''}
export async function GET(request: NextRequest) {
  try {
    ${hasDatabase ? `
    const data = await prisma.${name.toLowerCase()}.findMany()
    return NextResponse.json({ success: true, data })
    ` : `
    const data = { message: 'API route working', timestamp: new Date().toISOString() }
    return NextResponse.json({ success: true, data })
    `}
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    ${hasDatabase ? `
    const data = await prisma.${name.toLowerCase()}.create({ data: body })
    return NextResponse.json({ success: true, data }, { status: 201 })
    ` : `
    return NextResponse.json({ success: true, data: body }, { status: 201 })
    `}
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create data' }, { status: 500 })
  }
}`
}

function generateUtils(): string {
  return `export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}`
}

function generateTypes(name: string): string {
  return `export interface ${name} {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}`
}

function generatePrismaSchema(name: string, hasAuth: boolean): string {
  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${hasAuth ? `model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

` : ''}model ${name} {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`
}

function generateAuthActions(): string {
  return `'use server'

import { cookies } from 'next/headers'

export async function signIn(email: string, password: string) {
  // Implement authentication logic
  return { success: true, message: 'Signed in successfully' }
}

export async function signOut() {
  // Clear session
  return { success: true, message: 'Signed out successfully' }
}

export async function getSession() {
  // Get current session
  return null
}`
}

function generateEnvExample(hasDatabase: boolean, hasAuth: boolean): string {
  return `${hasDatabase ? 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n' : ''}${hasAuth ? 'NEXTAUTH_SECRET="your-secret-here"\nNEXTAUTH_URL="http://localhost:3000"\n' : ''}NEXT_PUBLIC_API_URL="http://localhost:3000/api"`
}

function generateFallbackComponent(prompt: string): string {
  const componentName = prompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('').replace(/[^a-zA-Z]/g, '') || 'Component'
  
  return `'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Star } from 'lucide-react'

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border-2 border-purple-500/30 p-8 shadow-2xl shadow-purple-500/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ${prompt || 'Generated Component'}
            </h1>
          </div>
          
          <p className="text-purple-300 mb-8 text-lg">
            This component was generated using vibe coding. Connect your AIMLAPI key for enhanced AI-powered generation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all"
            >
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-semibold text-purple-200 text-xl mb-2">Lightning Fast</h3>
              <p className="text-purple-300/70 text-sm">Build applications in seconds with vibe coding</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-pink-500/10 p-6 rounded-xl border border-pink-500/30 hover:border-pink-500/60 transition-all"
            >
              <Star className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="font-semibold text-pink-200 text-xl mb-2">Production Ready</h3>
              <p className="text-pink-300/70 text-sm">Deploy-ready code with best practices</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all"
            >
              <Sparkles className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-semibold text-purple-200 text-xl mb-2">AI-Powered</h3>
              <p className="text-purple-300/70 text-sm">Intelligent code generation and optimization</p>
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg shadow-purple-500/30"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}`.trim()
}
