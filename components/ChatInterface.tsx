'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  code?: string
  isError?: boolean
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isGenerating: boolean
  model: string
}

const EXAMPLE_PROMPTS = [
  "Create a modern login form with social auth buttons",
  "Build a dashboard with analytics charts and metrics",
  "Make an e-commerce product card with rating system",
  "Generate a responsive navbar with user menu dropdown"
]

export default function ChatInterface({ messages, onSendMessage, isGenerating, model }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleExampleClick = (prompt: string) => {
    if (!isGenerating) {
      onSendMessage(prompt)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-700'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div className={`rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                    : message.isError
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-[#1a1a2e]/80 border border-purple-500/20'
                }`}>
                  <p className="text-sm text-purple-100">{message.content}</p>
                  {message.code && (
                    <div className="mt-2 text-xs text-purple-300/70">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Code generated
                    </div>
                  )}
                  <div className="mt-2 text-xs text-purple-400/50">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#1a1a2e]/80 border border-purple-500/20 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-sm text-purple-300">Generating with {model}...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-purple-400 mb-2 font-semibold">Try these examples:</p>
          <div className="grid grid-cols-1 gap-2">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(prompt)}
                disabled={isGenerating}
                className="text-left text-xs text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg p-2 transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-purple-500/30 bg-[#1a1a2e]/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            disabled={isGenerating}
            className="flex-1 bg-[#0a0a0f] border border-purple-500/50 rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-all"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
