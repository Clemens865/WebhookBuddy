# Contributing to Webhook Buddy

Thank you for your interest in contributing to Webhook Buddy! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Node.js 16+ and npm
- Chrome browser for testing
- Git

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/webhook-buddy.git`
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Development Guidelines

### Code Style
- Use TypeScript with strict mode
- Follow ESLint and Prettier configurations
- Write JSDoc comments for all functions
- Keep files under 500 lines
- Use meaningful variable and function names

### Architecture Principles
- **Modularity**: Organize code into clear, separated modules
- **Single Responsibility**: Each component/function should have one purpose
- **Type Safety**: Use TypeScript types throughout
- **Error Handling**: Implement comprehensive error handling
- **Security**: Follow Chrome extension security best practices

### File Organization
```
src/
├── background/     # Background scripts
├── content/        # Content scripts
├── sidepanel/      # Main side panel app
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # API and data services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Testing

### Unit Tests
- Write tests for all new features
- Use Jest/Vitest for testing framework
- Mock external dependencies
- Aim for good test coverage

### Manual Testing
- Test in Chrome with the extension loaded
- Verify all four main features work:
  - Automation System
  - Prompts Management
  - Agent System
  - Voice System

## Pull Request Process

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Follow the coding guidelines above
3. **Add tests**: Ensure your changes are tested
4. **Run linting**: `npm run lint`
5. **Test thoroughly**: Manual and automated testing
6. **Commit with clear messages**: Use conventional commit format
7. **Push and create PR**: Include description of changes

### PR Requirements
- Clear description of what the PR does
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Follow the code review feedback

## Issue Reporting

### Bug Reports
Please include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### Feature Requests
Please include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## Security

- Never commit API keys or sensitive data
- Use Chrome's storage API for sensitive information
- Validate all user inputs
- Follow HTTPS for external requests
- Report security issues privately

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to open an issue for any questions about contributing!
