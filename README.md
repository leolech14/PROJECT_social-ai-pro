# 🎬 AI Video Creator - Social Media Content Generation Platform

An advanced AI-powered platform for creating viral social media videos. Transform your ideas into engaging content for TikTok, Instagram Reels, and YouTube Shorts using cutting-edge AI technologies.

🌐 **Live Demo**: [social-ai.pro](https://social-ai.pro)
📚 **Documentation**: [View Docs](./docs/)

## ✨ Features

### 🎯 3-Stage Creation Process

1. **Script Generation** - AI-powered script optimization using social media science
2. **Voice Selection** - Choose from multiple AI voices with different styles
3. **Video Assembly** - Combine stock footage, music, and captions automatically

### 🚀 Key Capabilities

- **Multi-Platform Optimization**: Tailored content for TikTok, Instagram Reels, and YouTube Shorts
- **AI Script Writing**: Powered by Google Gemini with viral content patterns
- **Voice Synthesis**: Multiple voice options with preview capability
- **Smart Media Selection**: AI-suggested stock footage and music
- **One-Click Generation**: Quick mode for automated creation
- **Mobile-First Design**: Fully responsive glassmorphic UI

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express.js + Node.js
- **AI Services**: 
  - Google AI Studio (Gemini) - Script generation
  - ElevenLabs - Voice synthesis (coming soon)
  - Stock APIs - Media selection (coming soon)
- **Deployment**: Vercel with Edge Functions
- **Analytics**: Vercel Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for Google AI Studio (optional for full functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/social-ai-pro.git
cd social-ai-pro

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env
# GOOGLE_AI_API_KEY=your_key_here
```

### Development

```bash
# Start both frontend and backend
npm run dev:all

# Or run separately:
npm run dev     # Frontend on http://localhost:3002
npm run server  # Backend on http://localhost:3003
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Environment Variables

See `.env.example` for all available configuration options:

- `OPENAI_API_KEY` - For OpenAI script generation (optional)
- `OPENAI_ORG_ID` - OpenAI organization ID (optional)
- `GOOGLE_AI_API_KEY` - For script generation
- `ELEVENLABS_API_KEY` - For voice synthesis (optional)
- `PEXELS_API_KEY` - For stock footage (optional)
- `VITE_API_URL` - Backend API URL

## 🗃️ Session Storage

Server sessions are stored in PostgreSQL using `connect-pg-simple`. Set
`DATABASE_URL` in your environment to point at your Postgres instance. The
session table is created automatically on startup, or you can create it
manually using the SQL in [`docs/SESSION_TABLE_SETUP.md`](docs/SESSION_TABLE_SETUP.md).

## 🗄️ Database Setup

The application now stores user data in PostgreSQL. To configure the database:

1. **Create a database** and update `DATABASE_URL` in your `.env` file. See `.env.example` for the format.
2. **Run migrations** to create the required tables:

   ```bash
   npm run migrate
   ```

   This executes all SQL files in the `migrations/` directory.

## 🎨 UI/UX Features

- **Dark Glassmorphic Design**: Modern, premium aesthetic
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Layout**: Mobile-first approach
- **Progressive Disclosure**: Show options as needed
- **Real-time Feedback**: Loading states and progress indicators

## 📁 Project Structure

```
social-ai-pro/
├── src/
│   ├── App.jsx           # Main React component with 3-stage UI
│   ├── services/         # AI service integrations
│   ├── index.css         # Tailwind styles
│   └── main.jsx          # React entry point
├── server.js             # Express backend
├── api/                  # Serverless functions
├── public/               # Static assets
│   └── manifest.json     # PWA configuration
└── knowledge_source/     # Research PDFs and documentation
```

## 🔒 Security

- Security headers configured in `vercel.json`
- Environment variables for sensitive data
- CORS enabled for API endpoints
- Rate limiting ready (configurable)

## 📊 Analytics & Monitoring

- Vercel Analytics integrated
- Real-time performance metrics
- Error tracking ready
- User engagement insights

## 🚢 Deployment

The app is configured for easy deployment on Vercel:

```bash
# Deploy to Vercel
vercel --prod

# Connect to GitHub for auto-deployment
# Visit: https://vercel.com/dashboard
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Run tests (coming soon)
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google AI Studio for script generation
- Vercel for hosting and analytics
- The open-source community for amazing tools

---

Built with ❤️ by the Social AI Pro team
