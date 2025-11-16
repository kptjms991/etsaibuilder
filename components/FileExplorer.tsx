'use client'

import { motion } from 'framer-motion'
import { FileCode, ChevronRight, File } from 'lucide-react'

interface FileItem {
  path: string
  content: string
  language: string
}

interface FileExplorerProps {
  files: FileItem[]
  selectedFile: FileItem | null
  onFileSelect: (file: FileItem) => void
}

export default function FileExplorer({ files, selectedFile, onFileSelect }: FileExplorerProps) {
  return (
    <div className="border-b border-purple-500/30 bg-[#0a0a0f]/50 backdrop-blur-sm">
      <div className="flex items-center space-x-2 p-3 border-b border-purple-500/20">
        <FileCode className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-semibold text-purple-300">Files ({files.length})</span>
      </div>
      <div className="flex overflow-x-auto">
        {files.map((file, index) => {
          const isSelected = selectedFile?.path === file.path
          return (
            <motion.button
              key={index}
              onClick={() => onFileSelect(file)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm border-r border-purple-500/20 hover:bg-purple-500/10 transition-colors ${
                isSelected ? 'bg-purple-500/20 text-purple-200' : 'text-purple-400'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <File className="w-3 h-3" />
              <span className="font-mono">{file.path.split('/').pop()}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
