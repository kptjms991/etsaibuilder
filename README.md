# eT's AI Builder 🚀

A revolutionary full-stack AI-powered vibe coding platform that transforms natural language into production-ready web applications.

## 🌟 What is eT's AI Builder?

eT's AI Builder is a Lovable.dev/v0.dev-inspired platform that democratizes web development through conversational AI. Simply describe what you want to build in natural language, and watch as our AI generates complete, production-ready code with live preview in real-time.

**Built with a stunning dark purple theme, animated particles, and glass morphism effects.**

## ✨ Key Features

### 🤖 AI-Powered Vibe Coding
- Natural language to complete application generation
- Support for multiple AI models (AIMLAPI, Claude, Gemini)
- Production-ready React/Next.js/TypeScript code
- Real-time streaming code generation
- Context-aware iterations and refinements

### 💻 Professional Development Environment
- **Split-screen interface**: Chat (40%) + Live Preview (60%)
- Syntax-highlighted code editor with copy functionality
- Multi-file project management with file explorer
- Responsive preview (Desktop/Tablet/Mobile views)
- Real-time error detection and console output

### 🎨 Pre-Built Component Library
- Authentication flows (Login, Register, Password Reset)
- Dashboard templates with analytics
- E-commerce components (Product cards, Cart, Checkout)
- Marketing sections (Hero, Features, Pricing, Testimonials)
- Form builders and UI components

### 📦 Export & Deploy
- Download complete project as ZIP file
- Push to GitHub repository
- One-click Vercel/Netlify deployment
- Share via public URL
- Environment variable configuration

### 🔄 Version Control & History
- Automatic snapshots on each generation
- Unlimited undo/redo functionality
- Version comparison with visual diff view
- Named checkpoints for major milestones
- Restore to any previous state

### 📊 Advanced Usage Tracking
- Real-time API usage metrics
- Token consumption tracking per model
- Request limit monitoring with progress bars
- Multi-model cost estimation
- Monthly quota visualization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
- AIMLAPI API key (get free at [aimlapi.com](https://aimlapi.com))
- Optional: Claude API key, Gemini API key for alternatives

### Quick Start

1. **Clone the repository:**
\`\`\`bash
git clone https://github.com/awesometjms-tech/etai-builder.git
cd etai-builder
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
# or
yarn install
# or
bun install
\`\`\`

3. **Set up environment variables:**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your API keys:
\`\`\`env
# Primary AI Provider (Required)
AIMLAPI_KEY=your_aimlapi_key_here

# Alternative Providers (Optional)
ANTHROPIC_API_KEY=your_claude_key_here
GOOGLE_API_KEY=your_gemini_key_here
\`\`\`

4. **Run the development server:**
\`\`\`bash
npm run dev
# or
yarn dev
# or
bun dev
\`\`\`

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Basic Vibe Coding Workflow

1. **Navigate to Builder**: Click "Start Building" or go to `/builder`
2. **Choose AI Model**: Select from AIMLAPI, Claude, or Gemini
3. **Describe Your Vision**: Type natural language prompts
4. **Review Generated Code**: Code appears with syntax highlighting
5. **Live Preview**: See your component rendered instantly
6. **Iterate**: Refine with follow-up prompts
7. **Export**: Download, deploy, or push to GitHub

### Example Vibe Coding Prompts

**✨ UI Components:**
\`\`\`
"Create a modern login form with email, password, and Google auth button"
"Build a responsive navbar with logo, navigation links, and user menu"
"Make a pricing section with 3 tiers, feature comparison, and CTA buttons"
"Design a testimonial carousel with star ratings and customer photos"
\`\`\`

**🔧 Functionality:**
\`\`\`
"Add form validation with real-time error messages"
"Implement dark mode toggle with persistence"
"Create a shopping cart with add/remove items and quantity controls"
"Add infinite scroll pagination to the blog posts list"
\`\`\`

**🎨 Styling Refinements:**
\`\`\`
"Make this design more modern with purple gradient backgrounds"
"Add smooth fade-in animations when components appear"
"Improve mobile responsiveness for tablets and phones"
"Use glass morphism effect on cards with backdrop blur"
\`\`\`

**🚀 Full-Stack Features:**
\`\`\`
"Create a complete authentication flow with email verification"
"Build a blog CMS with admin dashboard and post management"
"Generate API routes for CRUD operations on products"
"Set up Stripe payment integration for subscription billing"
\`\`\`

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19+
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Components**: Shadcn/ui + custom components
- **Animations**: Framer Motion + tsParticles
- **Syntax Highlighting**: Prism.js
- **State Management**: React hooks + SWR

### Backend
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes
- **AI Integration**: AIMLAPI.com, Anthropic Claude, Google Gemini
- **Validation**: Zod schemas

### Development Tools
- **Package Manager**: npm/yarn/bun
- **Code Quality**: ESLint, Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

\`\`\`
ets-ai-builder/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with theme
│   ├── globals.css              # Dark purple theme styles
│   ├── builder/
│   │   └── page.tsx             # Main builder interface
│   ├── features/
│   │   └── page.tsx             # Features showcase
│   ├── pricing/
│   │   └── page.tsx             # Pricing plans
│   ├── testimonials/
│   │   └── page.tsx             # User testimonials
│   └── api/
│       ├── generate/
│       │   └── route.ts         # AI code generation endpoint
│       └── export/
│           └── route.ts         # Project export functionality
├── components/
│   ├── AIBuilderPage.tsx        # Main builder component
│   ├── ChatInterface.tsx        # Conversational AI interface
│   ├── CodeEditor.tsx           # Syntax-highlighted editor
│   ├── FileExplorer.tsx         # Project file tree
│   ├── LivePreviewPane.tsx      # Real-time preview pane
│   ├── ResponsivePreview.tsx    # Device view switcher
│   ├── ComponentLibrary.tsx     # Pre-built templates
│   ├── ExportModal.tsx          # Export/deploy options
│   ├── Header.tsx               # Navigation header
│   ├── HeroSection.tsx          # Landing hero section
│   ├── FeatureCardsSection.tsx  # Feature showcase
│   ├── PricingSection.tsx       # Pricing tiers
│   ├── TestimonialsSection.tsx  # User reviews
│   ├── Footer.tsx               # Site footer
│   ├── ParticlesBackground.tsx  # Animated particles
│   └── integrations/
│       └── IntegrationModal.tsx # API integration UI
├── lib/
│   ├── types.ts                 # TypeScript definitions
│   ├── integration-engine.ts    # Component generator
│   ├── config.ts                # App configuration
│   └── utils.ts                 # Utility functions
├── docs/
│   └── PRODUCT_REQUIREMENTS.md  # Comprehensive PRD
├── public/
│   └── assets/                  # Static assets
├── .env.example                 # Environment variables template
└── README.md                    # This file
\`\`\`

## 🔑 Environment Variables

### Required
\`\`\`env
# Primary AI Provider
AIMLAPI_KEY=your_aimlapi_key_here
\`\`\`

### Optional (Alternative Providers)
\`\`\`env
# Claude API (Anthropic)
ANTHROPIC_API_KEY=your_claude_api_key_here

# Gemini API (Google)
GOOGLE_API_KEY=your_gemini_api_key_here
\`\`\`

### Getting API Keys

1. **AIMLAPI** (Recommended):
   - Sign up at [aimlapi.com](https://aimlapi.com)
   - Free tier includes generous limits
   - Access to multiple models (GPT-4, Claude, etc.)

2. **Claude** (Optional):
   - Get key from [console.anthropic.com](https://console.anthropic.com)
   - Claude 3.5 Sonnet for enhanced reasoning

3. **Gemini** (Optional):
   - Get key from [ai.google.dev](https://ai.google.dev)
   - Gemini Pro for fast generation

## 🎯 Features in Detail

### AI Builder Interface
- **40/60 Split Layout**: Chat on left, preview on right
- **Real-time Generation**: Watch code appear as AI writes it
- **Multi-file Projects**: Manage complex applications
- **File Explorer**: Navigate project structure
- **Responsive Preview**: Test on all device sizes

### Component Library
- **Quick Start Templates**: Launch projects instantly
- **Pre-built Components**: Drag and drop common UI elements
- **Theme Adaptation**: Components match your project style
- **Categories**: Auth, Forms, E-commerce, Dashboards, Marketing

### Export Options
1. **ZIP Download**: Complete project with all files
2. **GitHub Push**: Directly push to your repository
3. **Vercel Deploy**: One-click production deployment
4. **Netlify Deploy**: Alternative hosting option
5. **Copy Code**: Copy individual files to clipboard

### Usage Tracking Dashboard
- **Per-Model Metrics**: Track each AI provider separately
- **Token Consumption**: See how many tokens each request uses
- **Request Limits**: Visual progress bars for API quotas
- **Cost Estimation**: Approximate costs across providers
- **Reset Dates**: Know when limits refresh

## 🎨 Design System

### Color Palette
- **Primary**: Dark purple gradients (#7C3AED → #9333EA)
- **Background**: Dark navy (#0F172A, #1E1B4B)
- **Accent**: Electric purple (#A855F7)
- **Glass**: Frosted glass with backdrop-blur
- **Particles**: Animated stars with purple glow

### Typography
- **Font**: Inter (sans-serif)
- **Scales**: Responsive with mobile-first approach
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold)

### Effects
- **Glass Morphism**: Translucent cards with blur
- **Glow Effects**: Purple box-shadows on cards
- **Smooth Animations**: Framer Motion transitions
- **Particle Background**: Interactive star field

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/awesometjms-tech/etai-builder)

1. Click the deploy button above
2. Connect your GitHub account
3. Add environment variables (API keys)
4. Deploy automatically

### Deploy to Netlify

1. Fork this repository
2. Connect to Netlify
3. Add environment variables
4. Deploy

## 📊 Roadmap

### ✅ Current (MVP - v1.0)
- Core vibe coding engine with AIMLAPI
- Live preview with responsive device views
- File explorer and multi-file projects
- Export to ZIP and GitHub
- Component library with templates
- Usage tracking dashboard
- Syntax-highlighted code editor

### 🔄 Coming Soon (v1.1 - Q2 2025)
- User authentication and project saving
- Vercel/Netlify one-click deployment
- Database schema generation
- API route creation wizard
- Real-time collaboration (multiplayer)
- Enhanced debugging tools
- Performance optimization suggestions

### 🔮 Future (v2.0 - Q3 2025)
- Visual component editor (drag-and-drop)
- Mobile app (iOS/Android)
- Plugin system for extensibility
- Marketplace for templates
- Team workspaces
- Advanced analytics dashboard
- White-label solutions

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

Please ensure your PR:
- Follows TypeScript best practices
- Includes proper error handling
- Maintains the existing code style
- Updates documentation if needed

## 🐛 Known Issues & Limitations

- Large projects (100+ files) may experience slower preview updates
- AI generation quality depends on prompt clarity
- Some AI models have daily request limits
- Preview may not support all npm packages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Lovable.dev](https://lovable.dev) and [v0.dev](https://v0.dev)
- Powered by [AIMLAPI.com](https://aimlapi.com)
- Built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Animations by [Framer Motion](https://www.framer.com/motion)

## 📚 Documentation

- **[Product Requirements Document](docs/PRODUCT_REQUIREMENTS.md)**: Complete technical specifications
- **[API Documentation](#)**: Endpoint reference (coming soon)
- **[Component Guide](#)**: Detailed component documentation (coming soon)

## 🌐 Links

- **Website**: [etsaibuilder.com](#)
- **Documentation**: [docs.etsaibuilder.com](#)
- **GitHub**: [github.com/awesometjms-tech/etai-builder](https://github.com/awesometjms-tech/etai-builder)
- **Discord**: [Join our community](#)

## 📞 Support

Need help? We're here for you:

- 📧 **Email**: support@etsaibuilder.com
- 💬 **Discord**: Join our community server
- 🐛 **Issues**: [GitHub Issues](https://github.com/awesometjms-tech/etai-builder/issues)
- 📖 **Docs**: Check our documentation

## 💡 Tips for Best Results

1. **Be Specific**: Clear prompts get better results
2. **Iterate Gradually**: Make small refinements over big changes
3. **Use Examples**: Reference existing components when describing
4. **Check Preview**: Always test responsive views
5. **Save Often**: Export important milestones

---

**Transform your ideas into reality with the power of AI!** 🚀

Made with ❤️ by the eT's AI Builder Team
