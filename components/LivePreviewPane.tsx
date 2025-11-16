"use client"

import { useEffect, useRef } from "react"

interface LivePreviewPaneProps {
  code: string
}

export default function LivePreviewPane({ code }: LivePreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                body { 
                  margin: 0; 
                  padding: 16px; 
                  font-family: system-ui, -apple-system, sans-serif;
                  background: linear-gradient(to bottom right, #1a1a2e, #0a0a0f);
                  min-height: 100vh;
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                ${code}
                
                // Auto-render if there's a default export
                const root = ReactDOM.createRoot(document.getElementById('root'));
                try {
                  if (typeof Component !== 'undefined') {
                    root.render(<Component />);
                  }
                } catch (e) {
                  console.error('Preview error:', e);
                  root.render(<div style={{color: '#f87171', padding: '20px'}}>Error rendering component</div>);
                }
              </script>
            </body>
          </html>
        `)
        iframeDoc.close()
      }
    }
  }, [code])

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-space-grotesk text-purple-400 mb-4">Live Preview</h3>
      <div className="bg-[#0a0a0f] border border-purple-500/50 rounded-xl overflow-hidden h-96">
        <iframe ref={iframeRef} title="Live Preview" className="w-full h-full" sandbox="allow-scripts" />
      </div>
    </div>
  )
}
