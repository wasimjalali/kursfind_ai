# Contributing to Kursfind AI

Thank you for your interest in contributing to Kursfind AI! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Title**: Clear and descriptive
- **Description**: Detailed explanation of the bug
- **Steps to Reproduce**: Clear steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots
- **Environment**: 
  - OS and version
  - Node.js version
  - Browser version (if applicable)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Provide examples of how the enhancement would be used

### Pull Requests

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/kursfind_ai.git
   cd kursfind_ai
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear, descriptive commit messages
   - Add tests if applicable
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"  # or "fix: resolve bug"
   ```

   Use conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for code style changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Wait for review

## 📋 Code Style Guidelines

### General

- Use TypeScript for type safety
- Follow the existing code structure
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case for utilities (e.g., `api-client.js`)

### React/Next.js Specific

- Use functional components with hooks
- Use TypeScript interfaces for props
- Keep components in appropriate directories
- Use server components where possible (Next.js 15)

### Database (Supabase)

- Use descriptive table names (plural)
- Use snake_case for column names
- Implement Row Level Security (RLS) policies
- Add comments for complex queries

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test across different browsers if applicable
- Test mobile responsiveness

## 📝 Documentation

- Update README.md for user-facing changes
- Add inline comments for complex code
- Update API documentation if applicable
- Document any breaking changes

## 🌍 Localization

This project supports German and English. When adding new features:

- Add translations for both languages
- Use the existing translation structure
- Test both language versions

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Follow security best practices
- Report security vulnerabilities privately

## 📧 Getting Help

If you need help:

- Check existing documentation
- Search existing issues
- Ask questions in GitHub Discussions
- Contact maintainers for critical issues

## 📜 Code of Conduct

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## 🎯 Areas Where We Need Help

- **Feature Development**: New course filtering options, AI improvements
- **Bug Fixes**: UI/UX improvements, performance optimizations
- **Documentation**: Better setup guides, API documentation
- **Testing**: Unit tests, integration tests, E2E tests
- **Translations**: Additional language support

## 🙏 Recognition

Contributors will be recognized in the project's contributors list. Significant contributions may be featured in project announcements.

---

Thank you for contributing to Kursfind AI! Your help makes this project better for everyone.
