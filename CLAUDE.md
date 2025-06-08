# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based React TODO application project that demonstrates comprehensive quality engineering practices. The project has evolved from a simple Create React App to a production-ready application with robust testing, security, and quality assurance measures.

**Technology Stack:**
- React 19.1.0 with TypeScript
- Component-driven development with Storybook
- Comprehensive testing ecosystem (Unit, E2E, Acceptance, User Journey)
- Security-first development approach
- Japanese localization support

## Development Commands

### Core Development
- `npm start` - Runs development server on http://localhost:3000 with hot reload
- `npm run build` - Creates production build in `build/` folder
- `npm run build:check` - Build with security audit and quality checks

### Quality Assurance Commands
- `npm run lint` - Run ESLint for code quality and security analysis
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run audit` - Security vulnerability audit
- `npm run audit:fix` - Auto-fix security vulnerabilities

### Testing Commands
- `npm test` - Run unit tests in interactive watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:acceptance` - Run natural language acceptance tests
- `npm run test:journey` - Run user journey tests
- `npm run test:all` - Run comprehensive test suite (E2E + Acceptance + Journey)
- `npm run test:full` - Full test execution with coverage

### Component Development
- `npm run storybook` - Launch Storybook for component development and testing
- `npm run build-storybook` - Build static Storybook for deployment

## Architecture

### Project Structure
- **Entry point**: `src/index.tsx` renders the main App component
- **Main component**: `src/App.tsx` contains routing and application logic
- **Component library**: `src/components/ui/` - Reusable UI components with Storybook stories
- **Pages**: `src/pages/` - Application pages (Home, TodoApp)
- **Styling**: CSS modules co-located with components
- **Testing**: Multi-layered testing approach with comprehensive coverage

### TypeScript Migration
- Complete migration from JavaScript to TypeScript for type safety
- Strict TypeScript configuration for enhanced code quality
- Type definitions for external libraries where needed

### Component-Driven Development
- Modular UI components in `src/components/ui/`
- Storybook integration for component development and documentation
- Component stories for visual testing and documentation

## Quality Engineering Framework

### 1. Code Quality Standards
- **ESLint Configuration**: Comprehensive rules including security plugins
- **Prettier**: Consistent code formatting across the project
- **TypeScript**: Strict type checking for compile-time error prevention
- **Code Coverage**: Minimum thresholds enforced for test coverage

### 2. Security Measures
- **Security Audit Integration**: `npm audit` integrated into build process
- **ESLint Security Plugins**: Static analysis for security vulnerabilities
- **Dependency Management**: Regular package updates and vulnerability monitoring
- **Build-time Security Checks**: Automated security validation

### 3. Testing Strategy

#### Multi-Layer Testing Approach:
1. **Unit Tests** (`*.test.ts/tsx`)
   - Component behavior testing with React Testing Library
   - Business logic validation
   - Coverage-driven test development

2. **E2E Tests** (`tests/*.spec.js`)
   - Playwright-based browser automation
   - User interaction simulation
   - Cross-browser compatibility testing
   - Japanese font support for UI testing

3. **Acceptance Tests** (`tests/acceptance/`)
   - Natural language test scenarios
   - User story validation
   - Business requirement verification

4. **User Journey Tests** (`tests/acceptance/user-journey-tests.js`)
   - Real user behavior simulation
   - End-to-end workflow validation
   - Multi-persona testing scenarios

### 4. Internationalization Support
- **Japanese Font Integration**: Noto Sans JP for proper Japanese character display
- **Playwright Localization**: Japanese locale configuration for E2E tests
- **CSS Font Stack**: Comprehensive Japanese font fallbacks

## Quality Assurance Workflow

### Pre-Development Setup
1. Run `npm run audit` to check for security vulnerabilities
2. Ensure all dependencies are up to date
3. Execute `npm run lint` to verify code quality standards

### Development Process
1. **Component Development**: Use Storybook for isolated component development
2. **Type Safety**: Leverage TypeScript for compile-time error prevention
3. **Code Standards**: Follow ESLint and Prettier configurations
4. **Test-Driven Development**: Write tests alongside feature development

### Pre-Commit Validation
1. `npm run format:check` - Verify code formatting
2. `npm run lint` - Check code quality and security
3. `npm test` - Execute unit tests
4. `npm run build` - Verify build integrity

### Release Readiness Validation
1. `npm run test:all` - Execute comprehensive test suite
2. `npm run build:check` - Build with full security audit
3. `npm run test:coverage` - Verify test coverage thresholds
4. `npm run storybook` - Verify component documentation

### Quality Gates
- **All tests must pass**: 100% success rate required for E2E, Acceptance, and Journey tests
- **Security audit clean**: No high/critical vulnerabilities allowed
- **Lint compliance**: Zero ESLint errors or warnings
- **Type safety**: No TypeScript compilation errors
- **Test coverage**: Maintain minimum coverage thresholds

## Development Best Practices

### Security-First Development
- Always run `npm audit` before adding new dependencies
- Use ESLint security plugins for static code analysis
- Regular dependency updates to patch security vulnerabilities
- Build-time security validation integrated into CI/CD

### Component Development Guidelines
- Create reusable UI components with proper TypeScript interfaces
- Include Storybook stories for component documentation
- Follow CSS naming conventions and modular styling
- Ensure accessibility compliance in component design

### Testing Philosophy
- Write tests that describe user behavior, not implementation details
- Maintain high test coverage while focusing on meaningful tests
- Use the testing pyramid: many unit tests, some integration tests, few E2E tests
- Ensure Japanese language support in UI testing scenarios

### Performance Considerations
- Regular package updates for performance improvements
- Build optimization through webpack configuration
- Efficient component rendering patterns
- Load testing for user journey scenarios

## Troubleshooting

### Common Issues
- **Test Failures**: Ensure development server is running for E2E tests
- **Font Display Issues**: Japanese fonts are configured in CSS and Playwright settings
- **Build Errors**: Check TypeScript compilation and dependency compatibility
- **Security Alerts**: Run `npm audit fix` or update vulnerable packages

### Debug Commands
- Use `npm run test:e2e -- --headed` for visual E2E test debugging
- Check browser console in Playwright tests for JavaScript errors
- Use Storybook for isolated component debugging
- Enable test coverage reports to identify untested code paths