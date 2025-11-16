'use client'

import { useEffect, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeEditorProps {
  code: string
  language?: string
  readOnly?: boolean
  onChange?: (code: string) => void
}

export default function CodeEditor({ code, language = 'typescript', readOnly = true, onChange }: CodeEditorProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (codeRef.current && typeof window !== 'undefined') {
      // @ts-ignore
      if (window.Prism) {
        // @ts-ignore
        window.Prism.highlightElement(codeRef.current)
      }
    }
  }, [code])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg p-2 transition-all"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-purple-300" />
          )}
        </button>
      </div>
      
      <pre className="!bg-[#0a0a0f] !p-6 rounded-lg overflow-auto max-h-[600px] border border-purple-500/30">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
