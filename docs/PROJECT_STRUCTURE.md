# Project Structure

## Directory Layout

```
PROJECT_media/
├── src/                      # Source code
│   ├── components/          # React components
│   ├── services/            # Business logic services
│   ├── middleware/          # Express middleware
│   ├── utils/              # Utility functions
│   └── __tests__/          # Component tests
├── docs/                    # Documentation
│   ├── guides/             # Setup and deployment guides
│   ├── api/                # API documentation
│   └── architecture/       # Architecture decisions
├── scripts/                 # Build and utility scripts
│   ├── deployment/         # Deployment scripts
│   └── migrate.js          # Database migrations
├── migrations/              # SQL migration files
├── planning/               # Planning documents
├── archive/                # Archived/old files
├── knowledge_source/       # Reference PDFs
├── public/                 # Static assets
├── api/                    # Vercel serverless functions
└── tests/                  # Test suites
    ├── unit/              # Unit tests
    ├── integration/       # Integration tests
    └── e2e/               # End-to-end tests
```

## Key Files

### Configuration
- `package.json` - Project dependencies and scripts
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `jest.config.js` - Jest test configuration
- `vercel.json` - Vercel deployment configuration
- `.env.example` - Environment variables template

### Application Entry Points
- `index.html` - HTML entry point
- `src/main.jsx` - React application entry
- `server.js` - Express server
- `api/index.js` - Vercel serverless function

### Core Components
- `src/App.jsx` - Main application component
- `src/components/HeroScreen.jsx` - Landing page hero
- `src/components/ScriptForm.jsx` - Script generation form
- `src/components/ScriptReview.jsx` - Script review/edit
- `src/components/VoiceSelection.jsx` - Voice selection UI
- `src/components/VideoAssembly.jsx` - Video assembly UI

### Services
- `src/services/scriptGenerator.js` - AI script generation
- `src/services/voiceGenerator.js` - Voice synthesis
- `src/services/mediaService.js` - Stock media search
- `src/services/authService.js` - Authentication
- `src/services/demoGenerator.js` - Demo content generation

### Database
- `src/db.js` - Database connection
- `migrations/` - SQL migration files
- `scripts/migrate.js` - Migration runner