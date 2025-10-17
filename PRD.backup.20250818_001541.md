# PRD: PROJECT_media

*Generated: 2025-08-17 20:15:33*

## 1. CORE PHILOSOPHY & PURPOSE
**What this project actually does:**
- AI-powered video creation tool that generates social media content through a multi-stage workflow
- Takes user input text and transforms it into scripted video content with voice synthesis
- Provides a React-based web interface with animated transitions between creation stages

**Core philosophy:**
- Streamlined content creation pipeline: Input → Script Generation → Voice Selection → Video Assembly
- Multi-platform social media optimization with configurable tone and duration settings
- User-guided workflow with persistent data across creation stages

## 2. TECH STACK & FILES MAP
**Actual technologies found:**
- Frontend: React with Vite, Framer Motion animations, Tailwind CSS styling
- Backend: Express.js with session management, PostgreSQL database integration
- AI Services: Google Generative AI, ElevenLabs voice synthesis
- Authentication: JWT tokens, bcrypt password hashing, express-session
- Testing: Playwright for end-to-end testing

**Key files structure:**
- Total files: 30,358 (indicating a large, comprehensive codebase)
- Main components: HeroScreen, ScriptForm, ScriptReview, VoiceSelection, VideoAssembly
- API endpoints: `/api/generate-script` for AI script generation
- Database: PostgreSQL with session storage via connect-pg-simple

**Architecture pattern:**
- Multi-stage React SPA with state management for workflow progression
- RESTful API backend with rate limiting and CORS configuration
- Session-based user management with PostgreSQL persistence

## 3. RECENT CHANGES & ACTIVITY
**Development status:**
- Active development with comprehensive documentation structure in place
- Recent focus on AI integrations (OpenAI 2025 updates documented)
- Deployment guides and setup documentation suggest production readiness

**Active areas:**
- AI service integrations (Google AI, OpenAI, ElevenLabs)
- UI/UX refinements with creative brief documentation
- Database session management and user authentication systems

## 4. LEGACY VERSIONS & COMPONENTS
**Component evolution:**
- Legacy file identified: `retool-app-template.js` (suggests migration from Retool platform)
- Package name "social-ai-pro" with generic Vite template description indicates rebranding/evolution

**Technical debt:**
- Multiple duplicate README.md files in key_files array suggests documentation organization needs
- Large file count (30K+ files) may indicate accumulated dependencies or generated content
- No CI/CD or Docker configuration despite production-ready features