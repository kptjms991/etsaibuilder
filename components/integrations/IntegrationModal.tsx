"use client"

import { useState } from "react"
import { X, Sparkles, Zap, Code, Eye, Copy, Check } from "lucide-react"

interface IntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onIntegrationAdded: (integration: any) => void
}

export function IntegrationModal({ isOpen, onClose, onIntegrationAdded }: IntegrationModalProps) {
  const [activeTab, setActiveTab] = useState<"api" | "preview" | "code">("api")
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [jsonResponse, setJsonResponse] = useState("")
  const [uiInstruction, setUiInstruction] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [parsedResponse, setParsedResponse] = useState<any>(null)

  // Sample API templates for quick start
  const apiTemplates = [
    {
      name: "Weather API",
      endpoint: "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY",
      response: JSON.stringify(
        {
          weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
          main: { temp: 15.5, feels_like: 14.8, humidity: 65 },
          name: "London",
        },
        null,
        2,
      ),
    },
    {
      name: "News API",
      endpoint: "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY",
      response: JSON.stringify(
        {
          articles: [
            {
              title: "Breaking News",
              description: "Important news story",
              url: "https://example.com",
              publishedAt: "2024-01-01T00:00:00Z",
            },
          ],
        },
        null,
        2,
      ),
    },
  ]

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleJsonChange = (value: string) => {
    setJsonResponse(value)
    try {
      const parsed = JSON.parse(value)
      setParsedResponse(parsed)
    } catch {
      setParsedResponse(null)
    }
  }

  const handleIntegrate = async () => {
    setIsGenerating(true)

    // Simulate API processing with animation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const integration = {
      id: `integration-${Date.now()}`,
      endpoint: apiEndpoint,
      response: parsedResponse,
      instruction: uiInstruction,
      component: generateComponentCode(apiEndpoint, parsedResponse),
      createdAt: new Date().toISOString(),
    }

    onIntegrationAdded(integration)
    setIsGenerating(false)
    onClose()

    // Reset form
    setApiEndpoint("")
    setJsonResponse("")
    setUiInstruction("")
  }

  const generateComponentCode = (endpoint: string, response: any) => {
    return `
// Auto-generated API Integration Component
import { useState, useEffect } from 'react';

export function APIIntegration() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('${endpoint}');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  
  return (
    <div className="api-integration">
      {/* Dynamic content based on API response */}
      ${
        response
          ? Object.keys(response)
              .map(
                (key) =>
                  `<div key="${key}" className="data-field">
          <strong>${key}:</strong> {data?.${key}}
        </div>`,
              )
              .join("\n      ")
          : "<!-- No data structure -->"
      }
    </div>
  );
}
    `.trim()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur and purple tint */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-gray-900 to-purple-900/20 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          animation: "modalEnter 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/40 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  API Integration
                </h2>
                <p className="text-purple-300/80 text-sm mt-1">Connect external services and data sources</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-purple-300 group-hover:text-purple-100" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-500/20 bg-gray-900/50">
          {[
            { id: "api" as const, label: "API Configuration", icon: Zap },
            { id: "preview" as const, label: "Data Preview", icon: Eye },
            { id: "code" as const, label: "Generated Code", icon: Code },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                activeTab === id
                  ? "border-purple-400 text-purple-100 bg-purple-500/10"
                  : "border-transparent text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* API Configuration Tab */}
          {activeTab === "api" && (
            <div className="space-y-6">
              {/* Quick Templates */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-3">Quick Start Templates</label>
                <div className="grid grid-cols-2 gap-3">
                  {apiTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setApiEndpoint(template.endpoint)
                        setJsonResponse(template.response)
                      }}
                      className="p-3 text-left bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-purple-100 font-medium group-hover:text-white">{template.name}</span>
                        <Copy className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Endpoint */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-purple-200">API Endpoint URL</label>
                  {apiEndpoint && (
                    <button
                      onClick={() => copyToClipboard(apiEndpoint, "endpoint")}
                      className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {copiedField === "endpoint" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://api.example.com/v1/data?param=value"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Sample Response */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-purple-200">Sample JSON Response</label>
                  {jsonResponse && (
                    <button
                      onClick={() => copyToClipboard(jsonResponse, "response")}
                      className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {copiedField === "response" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                <textarea
                  value={jsonResponse}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder='{"key": "value", "data": [...]}'
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 font-mono text-sm"
                />
              </div>

              {/* UI Instructions */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-3">UI Integration Instructions</label>
                <textarea
                  value={uiInstruction}
                  onChange={(e) => setUiInstruction(e.target.value)}
                  placeholder="Describe how this data should be displayed... (e.g., 'Show as a grid of cards on the homepage')"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Data Preview Tab */}
          {activeTab === "preview" && parsedResponse && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Valid JSON Structure Detected</span>
                </div>
              </div>

              <div className="bg-gray-800/30 border border-purple-500/20 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-900/50 border-b border-purple-500/20">
                  <h3 className="text-purple-200 font-medium">Data Structure Preview</h3>
                </div>
                <pre className="p-4 text-purple-100 text-sm overflow-x-auto">
                  {JSON.stringify(parsedResponse, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <div className="text-purple-400">Root Keys</div>
                  <div className="text-purple-100 font-mono mt-1">{Object.keys(parsedResponse).join(", ")}</div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <div className="text-purple-400">Data Type</div>
                  <div className="text-purple-100 font-mono mt-1">
                    {Array.isArray(parsedResponse) ? "Array" : "Object"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Code Tab */}
          {activeTab === "code" && apiEndpoint && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-purple-200 font-medium">Generated React Component</h3>
                <button
                  onClick={() => copyToClipboard(generateComponentCode(apiEndpoint, parsedResponse), "code")}
                  className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-100 hover:bg-purple-500/30 transition-all duration-200"
                >
                  {copiedField === "code" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">Copy Code</span>
                </button>
              </div>

              <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden">
                <pre className="p-4 text-purple-100 text-sm overflow-x-auto">
                  <code>{generateComponentCode(apiEndpoint, parsedResponse)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-gray-900/30 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-purple-300/70">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Powered by Claude Integration Engine</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-purple-300 hover:text-purple-100 transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              onClick={handleIntegrate}
              disabled={!apiEndpoint || !jsonResponse || isGenerating}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Integrate API</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-10 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
