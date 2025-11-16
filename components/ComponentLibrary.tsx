'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Layout, CreditCard, User, Menu, Database, Lock, Mail } from 'lucide-react'

interface ComponentTemplate {
  id: string
  name: string
  category: string
  icon: any
  prompt: string
  preview: string
}

const componentTemplates: ComponentTemplate[] = [
  {
    id: 'login-form',
    name: 'Login Form',
    category: 'Authentication',
    icon: Lock,
    prompt: 'Create a modern login form with email/password fields and social auth buttons (Google, GitHub)',
    preview: 'Modern login with social auth'
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'Layouts',
    icon: Layout,
    prompt: 'Build a responsive dashboard with sidebar navigation, analytics cards, and charts',
    preview: 'Analytics dashboard layout'
  },
  {
    id: 'product-card',
    name: 'Product Card',
    category: 'E-commerce',
    icon: CreditCard,
    prompt: 'Generate an e-commerce product card with image, title, price, rating, and add to cart button',
    preview: 'E-commerce product display'
  },
  {
    id: 'user-profile',
    name: 'User Profile',
    category: 'User',
    icon: User,
    prompt: 'Create a user profile page with avatar, bio, stats, and edit functionality',
    preview: 'User profile with stats'
  },
  {
    id: 'navbar',
    name: 'Navigation Bar',
    category: 'Navigation',
    icon: Menu,
    prompt: 'Make a responsive navbar with logo, menu items, user dropdown, and mobile hamburger',
    preview: 'Responsive navigation'
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'Forms',
    icon: Mail,
    prompt: 'Create a contact form with name, email, subject, message fields and validation',
    preview: 'Contact form with validation'
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'Data',
    icon: Database,
    prompt: 'Build a data table with sorting, filtering, pagination, and row actions',
    preview: 'Interactive data table'
  },
]

interface ComponentLibraryProps {
  onSelectTemplate: (prompt: string) => void
}

export default function ComponentLibrary({ onSelectTemplate }: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(componentTemplates.map(t => t.category)))]

  const filteredTemplates = componentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]/50 backdrop-blur-sm border-l border-purple-500/30">
      <div className="p-4 border-b border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Component Library</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-purple-500/50 rounded-lg pl-10 pr-4 py-2 text-sm text-purple-200 placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredTemplates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => onSelectTemplate(template.prompt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 text-left hover:border-purple-500/60 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <template.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-200 mb-1">{template.name}</h4>
                  <p className="text-xs text-purple-400/70">{template.preview}</p>
                  <span className="inline-block mt-2 text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
