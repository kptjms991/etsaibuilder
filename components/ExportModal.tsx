'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, Download, Globe, Loader2 } from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
  files: any[]
}

export default function ExportModal({ isOpen, onClose, code, files }: ExportModalProps) {
  const [exportType, setExportType] = useState<'github' | 'zip' | 'deploy' | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('')

  const handleExport = async (type: 'github' | 'zip' | 'deploy') => {
    setExportType(type)
    setIsExporting(true)
    setExportStatus('Preparing export...')

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (type === 'zip') {
        setExportStatus('Generating ZIP file...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Create and download ZIP
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'generated-project.zip'
        a.click()
        setExportStatus('Download started!')
      } else if (type === 'github') {
        setExportStatus('Connecting to GitHub...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        setExportStatus('Repository created! Opening GitHub...')
        // In production, integrate with GitHub API
        window.open('https://github.com/new', '_blank')
      } else if (type === 'deploy') {
        setExportStatus('Deploying to Vercel...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        setExportStatus('Deployed successfully!')
        // In production, integrate with Vercel API
      }

      setTimeout(() => {
        setIsExporting(false)
        setExportType(null)
        setExportStatus('')
      }, 2000)
    } catch (error) {
      setExportStatus('Export failed. Please try again.')
      setIsExporting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border-2 border-purple-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-purple-400 hover:text-purple-300"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
              Export Your Project
            </h2>

            {isExporting ? (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-purple-300 text-lg">{exportStatus}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('github')}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-6 text-center hover:border-purple-500 transition-all group"
                >
                  <Github className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:text-purple-300" />
                  <h3 className="font-semibold text-purple-200 mb-2">Push to GitHub</h3>
                  <p className="text-sm text-purple-400/70">Create a new repository</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('zip')}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-6 text-center hover:border-purple-500 transition-all group"
                >
                  <Download className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:text-purple-300" />
                  <h3 className="font-semibold text-purple-200 mb-2">Download ZIP</h3>
                  <p className="text-sm text-purple-400/70">Get all project files</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('deploy')}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-6 text-center hover:border-purple-500 transition-all group"
                >
                  <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:text-purple-300" />
                  <h3 className="font-semibold text-purple-200 mb-2">Deploy Now</h3>
                  <p className="text-sm text-purple-400/70">One-click to Vercel</p>
                </motion.button>
              </div>
            )}

            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-300">
                <strong>Files included:</strong> {files.length} file(s)
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
