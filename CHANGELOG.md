# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Request validation with Zod schemas
- PostgreSQL persistence for user data
- Database migration system
- Support for Node.js audio buffers in voice generation
- Comprehensive test coverage improvements
- Environment variables documentation

### Changed
- Updated to Gemini 2.5 Flash model
- Improved test mocking structure
- Enhanced rate limiting for auth endpoints
- Reorganized project structure for better maintainability

### Fixed
- Voice generator now properly handles audio buffer responses
- Test setup issues with React 19 and framer-motion
- Authentication rate limiter configuration

## [0.2.0] - 2025-08-02

### Added
- Voice Selection UI with all providers (OpenAI, ElevenLabs, Google)
- Script review/edit stage before voice selection
- Contextual demo sentence generation
- Voice preview functionality
- Social Media Science principles integration
- Beautiful animated hero section

### Changed
- Updated to latest AI models (GPT-4 Turbo, Gemini 2.5)
- Improved UI with glassmorphic design
- Enhanced script generation with viral content patterns

## [0.1.0] - 2025-07-01

### Added
- Initial project setup with React + Vite
- Basic script generation with Google Gemini
- Simple voice synthesis integration
- Three-stage workflow (Script → Voice → Video)
- Express.js backend
- JWT authentication
- Rate limiting
- Basic UI components

---

## Version History

- **0.2.0** - Beta Release (Current)
- **0.1.0** - Alpha Release
- **0.0.1** - Initial Commit