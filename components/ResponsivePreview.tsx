'use client'

import { useState } from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

interface ResponsivePreviewProps {
  code: string
}

export default function ResponsivePreview({ code }: ResponsivePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Device Selector */}
      <div className="flex items-center justify-center space-x-2 p-4 border-b border-purple-500/30">
        <button
          onClick={() => setDevice('desktop')}
          className={`p-2 rounded-lg transition-all ${
            device === 'desktop'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500'
              : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
          }`}
        >
          <Monitor className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={`p-2 rounded-lg transition-all ${
            device === 'tablet'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500'
              : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
          }`}
        >
          <Tablet className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`p-2 rounded-lg transition-all ${
            device === 'mobile'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500'
              : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
          }`}
        >
          <Smartphone className="w-5 h-5" />
        </button>
        <span className="ml-4 text-sm text-purple-300">
          {deviceSizes[device].width} × {deviceSizes[device].height}
        </span>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <motion.div
          key={device}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: deviceSizes[device].width,
            height: deviceSizes[device].height,
          }}
          className="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-gray-800"
        >
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <script src="https://cdn.tailwindcss.com"></script>
                  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
                  <style>
                    body { 
                      font-family: system-ui, -apple-system, sans-serif; 
                      margin: 0;
                      padding: 0;
                    }
                    * { box-sizing: border-box; }
                  </style>
                </head>
                <body>
                  <div id="root"></div>
                  <script type="module">
                    ${code}
                  </script>
                </body>
              </html>
            `}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </motion.div>
      </div>
    </div>
  )
}
