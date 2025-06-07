# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standard Create React App project bootstrapped with `create-react-app`. It uses React 19.1.0 and includes a basic setup with testing utilities.

## Development Commands

- `npm start` - Runs development server on http://localhost:3000 with hot reload
- `npm test` - Runs tests in interactive watch mode
- `npm run build` - Creates production build in `build/` folder
- `npm run eject` - Ejects from Create React App (irreversible)

## Architecture

- **Entry point**: `src/index.js` renders the main App component
- **Main component**: `src/App.js` contains the primary application logic
- **Styling**: CSS files are co-located with components (e.g., `App.css`)
- **Testing**: Uses React Testing Library and Jest (via `react-scripts`)
- **Build system**: Uses react-scripts which handles Webpack, Babel, and ESLint configuration

## Testing

- Test files follow the `*.test.js` convention
- Uses `@testing-library/react` for component testing
- Run specific tests with: `npm test -- --testNamePattern="test name"`
- Tests run in watch mode by default during development