"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ParticlesBackground from "./ParticlesBackground"
import LivePreviewPane from "./LivePreviewPane"
import FileExplorer from "./FileExplorer"
import ChatInterface from "./ChatInterface"
import CodeEditor from "./CodeEditor"
import ResponsivePreview from "./ResponsivePreview"
import ComponentLibrary from "./ComponentLibrary"
import ExportModal from "./ExportModal"
import { Sparkles, Code2, Play, Download, Layers, FileCode } from 'lucide-react'

export default function AIBuilderPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Welcome to eT AI Builder! Describe your idea and I\'ll generate production-ready code instantly. Try: "Create a modern login form with social auth buttons"',
      timestamp: new Date()
    }
  ])
  const [generatedCode, setGeneratedCode] = useState("")
  const [files, setFiles] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiUsage, setApiUsage] = useState<any>(null)
  const [activeModel, setActiveModel] = useState("gpt-4")
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'split'>('split')
  const [showComponentLibrary, setShowComponentLibrary] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const availableModels = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  ]

  useEffect(() => {
    fetchApiUsage()
  }, [])

  const fetchApiUsage = async () => {
    try {
      const response = await fetch("/api/generate")
      if (response.ok) {
        const data = await response.json()
        setApiUsage(data.usage)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch API usage:", error)
    }
  }

  const handleSendMessage = async (prompt: string) => {
    // Add user message
    const userMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: activeModel,
          context: messages.slice(-5) // Last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate component")
      }

      const data = await response.json()

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: `Generated ${data.files?.length || 1} file(s) for your "${prompt}" request.`,
        timestamp: new Date(),
        code: data.code
      }
      setMessages(prev => [...prev, aiMessage])
      
      setGeneratedCode(data.code)
      setFiles(data.files || [])
      if (data.files && data.files.length > 0) {
        setSelectedFile(data.files[0])
      }

      if (data.usage) {
        await fetchApiUsage()
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTemplateSelect = (prompt: string) => {
    handleSendMessage(prompt)
    setShowComponentLibrary(false)
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] text-white overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-purple-500/30 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                eT AI Builder
              </h1>
            </div>
            
            {/* Model Selector */}
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-[#1a1a2e] border border-purple-500/50 rounded-lg px-4 py-2 text-sm text-purple-200 focus:outline-none focus:border-purple-500 transition-colors"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>

            {/* API Usage */}
            {apiUsage && (
              <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
                <div className="text-xs text-purple-300">
                  <span className="font-semibold">{apiUsage.requests}/{apiUsage.limit}</span> requests
                </div>
                <div className="w-24 bg-purple-950/50 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${(apiUsage.requests / apiUsage.limit) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowExportModal(true)}
                className="p-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5 text-purple-400" />
              </button>
              <button 
                onClick={() => setShowComponentLibrary(!showComponentLibrary)}
                className="flex items-center space-x-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Library</span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-lg transition-all">
                <Play className="w-4 h-4" />
                <span className="text-sm font-semibold">Deploy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Chat Interface (40%) */}
          <div className="w-2/5 border-r border-purple-500/30 bg-[#0a0a0f]/50 backdrop-blur-sm flex flex-col">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              model={activeModel}
            />
          </div>

          {/* Right Side - Code/Preview */}
          <div className={`flex flex-col ${showComponentLibrary ? 'w-2/5' : 'w-3/5'}`}>
            {/* File Explorer */}
            {files.length > 0 && (
              <FileExplorer
                files={files}
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            )}

            <div className="flex-1 overflow-hidden">
              {generatedCode ? (
                <div className="h-full flex flex-col">
                  {/* Tabs */}
                  <div className="flex border-b border-purple-500/30 bg-[#1a1a2e]/50">
                    <button 
                      onClick={() => setViewMode('code')}
                      className={`px-4 py-2 text-sm font-semibold ${
                        viewMode === 'code'
                          ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                          : 'text-gray-400 hover:text-purple-300'
                      }`}
                    >
                      <Code2 className="w-4 h-4 inline mr-2" />
                      Code
                    </button>
                    <button 
                      onClick={() => setViewMode('preview')}
                      className={`px-4 py-2 text-sm font-semibold ${
                        viewMode === 'preview'
                          ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                          : 'text-gray-400 hover:text-purple-300'
                      }`}
                    >
                      <Layers className="w-4 h-4 inline mr-2" />
                      Preview
                    </button>
                    <button 
                      onClick={() => setViewMode('split')}
                      className={`px-4 py-2 text-sm font-semibold ${
                        viewMode === 'split'
                          ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                          : 'text-gray-400 hover:text-purple-300'
                      }`}
                    >
                      Split View
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-hidden">
                    {viewMode === 'code' && (
                      <div className="h-full overflow-auto bg-[#0a0a0f] p-6">
                        <CodeEditor code={selectedFile?.content || generatedCode} language="typescript" />
                      </div>
                    )}
                    {viewMode === 'preview' && (
                      <ResponsivePreview code={selectedFile?.content || generatedCode} />
                    )}
                    {viewMode === 'split' && (
                      <div className="h-full grid grid-cols-2 gap-4 p-4">
                        <div className="overflow-auto">
                          <CodeEditor code={selectedFile?.content || generatedCode} language="typescript" />
                        </div>
                        <ResponsivePreview code={selectedFile?.content || generatedCode} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-purple-300/50">
                  <div className="text-center">
                    <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your generated code will appear here</p>
                    <p className="text-sm mt-2">Start by describing what you want to build</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showComponentLibrary && (
            <div className="w-1/5">
              <ComponentLibrary onSelectTemplate={handleTemplateSelect} />
            </div>
          )}
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        code={generatedCode}
        files={files}
      />
    </section>
  )
}
