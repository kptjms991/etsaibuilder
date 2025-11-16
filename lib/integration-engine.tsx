"use client"

import type { IntegrationConfig, Integration } from "./types"

export interface UISchema {
  title: string
  fields: Array<{
    key: string
    label: string
    type: string
    isArray?: boolean
  }>
}

export class IntegrationEngine {
  /**
   * Main entry point: Generate a complete React component from integration config
   */
  static generateComponent(integrationConfig: IntegrationConfig): Integration {
    const { request, response, instruction } = integrationConfig

    // Parse URL and extract parameters
    const url = new URL(request)
    const params = Object.fromEntries(url.searchParams.entries())

    // Analyze JSON response to create UI schema
    const uiSchema = this.createUISchema(response)

    // Generate functional component code
    const componentCode = this.generateComponentCode(request, uiSchema, response)

    // Determine where to place the component based on instruction
    const placement = this.determinePlacement(instruction)

    return {
      id: `integration-${Date.now()}`,
      endpoint: request,
      response,
      instruction,
      component: componentCode,
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Create a UI schema by analyzing the JSON response structure
   */
  static createUISchema(jsonResponse: any): UISchema {
    const schema: UISchema = {
      title: "API Data",
      fields: [],
    }

    if (!jsonResponse) return schema

    // Handle arrays
    if (Array.isArray(jsonResponse)) {
      if (jsonResponse.length > 0) {
        const firstItem = jsonResponse[0]
        Object.keys(firstItem).forEach((key) => {
          schema.fields.push({
            key,
            label: this.formatLabel(key),
            type: typeof firstItem[key],
            isArray: true,
          })
        })
      }
      return schema
    }

    // Handle nested objects
    Object.keys(jsonResponse).forEach((key) => {
      const value = jsonResponse[key]
      const isArray = Array.isArray(value)
      const type = isArray ? typeof value[0] : typeof value

      schema.fields.push({
        key,
        label: this.formatLabel(key),
        type: isArray ? "array" : type,
        isArray,
      })
    })

    return schema
  }

  /**
   * Generate the actual React component code as a string
   */
  static generateComponentCode(endpoint: string, uiSchema: UISchema, sampleResponse: any): string {
    const isArrayResponse = Array.isArray(sampleResponse)

    return `
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export function APIIntegration() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('${endpoint}');
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('[v0] API Integration Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-3 text-purple-300">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Error loading data</span>
        </div>
        <p className="mt-2 text-red-300/80 text-sm">{error}</p>
      </div>
    );
  }

  ${this.generateRenderLogic(uiSchema, isArrayResponse)}
}
`.trim()
  }

  /**
   * Generate the JSX render logic based on the UI schema
   */
  private static generateRenderLogic(uiSchema: UISchema, isArrayResponse: boolean): string {
    if (isArrayResponse) {
      return `
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-200">${uiSchema.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data && data.map((item, index) => (
          <div 
            key={index}
            className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all duration-200"
          >
            ${uiSchema.fields
              .map(
                (field) => `
            <div className="mb-3">
              <span className="text-purple-400 text-sm font-medium">${field.label}</span>
              <p className="text-purple-100 mt-1">{item.${field.key}}</p>
            </div>`,
              )
              .join("")}
          </div>
        ))}
      </div>
    </div>
  );
      `.trim()
    }

    return `
  return (
    <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
      <h2 className="text-2xl font-bold text-purple-200 mb-6">${uiSchema.title}</h2>
      <div className="space-y-4">
        ${uiSchema.fields
          .map(
            (field) => `
        <div className="p-4 bg-gray-800/30 rounded-lg">
          <span className="text-purple-400 text-sm font-medium block mb-2">${field.label}</span>
          <p className="text-purple-100">
            {${field.isArray ? `JSON.stringify(data?.${field.key}, null, 2)` : `data?.${field.key}`}}
          </p>
        </div>`,
          )
          .join("")}
      </div>
    </div>
  );
    `.trim()
  }

  /**
   * Determine component placement based on user instruction
   */
  private static determinePlacement(instruction: string): string {
    const lower = instruction.toLowerCase()

    if (lower.includes("home") || lower.includes("main")) {
      return "homepage"
    } else if (lower.includes("dashboard")) {
      return "dashboard"
    } else if (lower.includes("sidebar")) {
      return "sidebar"
    } else if (lower.includes("header")) {
      return "header"
    } else if (lower.includes("footer")) {
      return "footer"
    }

    return "main-content"
  }

  /**
   * Format a camelCase or snake_case key into a readable label
   */
  private static formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capitals
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim()
  }

  /**
   * Validate JSON structure
   */
  static validateJSON(jsonString: string): { valid: boolean; error?: string; parsed?: any } {
    try {
      const parsed = JSON.parse(jsonString)
      return { valid: true, parsed }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid JSON",
      }
    }
  }

  /**
   * Validate API endpoint URL
   */
  static validateEndpoint(endpoint: string): { valid: boolean; error?: string } {
    try {
      new URL(endpoint)
      return { valid: true }
    } catch {
      return { valid: false, error: "Invalid URL format" }
    }
  }
}
