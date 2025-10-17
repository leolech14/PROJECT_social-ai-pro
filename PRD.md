# PROJECT_media - AI Video Creator Platform

## Core Philosophy & Purpose
PROJECT_media is an AI-powered video creation platform that streamlines content production through automated script generation, voice synthesis, and multi-stage creation workflows. The platform integrates multiple AI services (OpenAI GPT-4, Google Gemini, ElevenLabs) to provide comprehensive tools for creating professional video content with minimal manual effort.

## Current Tech Stack
**Core Technologies:**
- **React 18 + Vite** - Modern frontend with fast build tooling
- **Express.js + Node.js** - Backend API and server architecture
- **PostgreSQL** - Database with session management
- **JWT Authentication** - Secure user authentication
- **Zod** - Request validation and schema definition

**AI Integration:**
- **OpenAI GPT-4 + Google Gemini** - AI-powered script generation
- **OpenAI TTS + ElevenLabs** - Advanced voice synthesis
- **Playwright** - Browser automation for Retool integration
- **Social Media Science** - Content optimization principles

## Project Structure
**Key Directories:**
- Frontend React application with component-based architecture
- Express.js backend with comprehensive API endpoints
- PostgreSQL database with session management
- Retool integration for advanced UI automation
- Comprehensive test suite and environment configuration

**Critical Files:**
- `PROJECT_STATUS.md` - Current development state and completed features
- `RETOOL_COMPLETE_SETUP.md` - Integration documentation
- `DREAM_TEAM_IMPLEMENTATION_PLAN.md` - Architecture planning
- `POWERUSER_RETOOL_AI_GUIDE.md` - Advanced automation guide

## Recent Development
- Core AI functionality with script generation and voice synthesis
- Multi-stage creation workflow with review and editing capabilities
- Complete authentication and session management system
- Rate limiting and request validation implementation
- Vercel deployment configuration and production setup
- Playwright automation for Retool interface interactions

## Status
**Beta** - Platform is in beta with core AI-powered features implemented, comprehensive testing completed, and production deployment ready. The system successfully integrates multiple AI services for automated video content creation.

**Performance Optimizations**:
- Efficient algorithms and data structures
- Caching strategies for improved response times
- Asynchronous processing for non-blocking operations
- Database query optimization and indexing

### The Origin Story

**Why This Project Exists**: Developed to streamline content creation and distribution workflows that were consuming excessive time and resources. The creator recognized the need for intelligent automation in media management.

**Personal Motivation**: This project represents more than just code - it's a solution to real problems faced in Media/Content. Every feature has been carefully considered based on actual use cases and user feedback.

**Evolution**: Started as a simple proof of concept, Media has evolved through iterative development, incorporating lessons learned and user feedback to become a comprehensive solution.

### The Vision

**Where We're Heading**:
- **Immediate Goals**: Complete MVP features, establish core functionality, gather user feedback
- **Mid-term Objectives**: Scale the solution, add requested features, improve reliability
- **Long-term Vision**: Transform how Media/Content problems are solved through innovation and automation

**Success Metrics**:
- User adoption and satisfaction rates
- Performance benchmarks and reliability metrics
- Integration ecosystem growth
- Community engagement and contributions

**Differentiation**: Unlike existing solutions, Media focuses on:
- User-centric design with minimal learning curve
- Automation-first approach to reduce manual work
- Extensible architecture for custom requirements
- Open standards and integration capabilities

---



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