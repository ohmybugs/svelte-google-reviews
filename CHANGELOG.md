# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-07-11

### Added

- **Storybook**: New CustomSlotExample wrapper component for custom slot story
- **Testing**: Vitest browser project for component story tests and coverage
- **Stories**: V2DataTransformed story demonstrating data transformation with ErrorState and LoadingState stories

### Fixed

- **Storybook**: Restore autodocs and story descriptions by adding addon-docs
- **CI**: Skip storybook browser project when CI environment variable is set

### Changed

- **Storybook**: Upgrade to Storybook 10 and add addon-vitest integration
- **Coverage**: Switch coverage tool to Istanbul and run all vitest projects
- **Documentation**: Add JSDoc descriptions to all component props for Storybook Args table visibility

### Documentation

- Improve custom slot story documentation and control wiring
- Add component and story descriptions for Badge and ReviewCard components

### Chores

- Add pre-push hook to validate tag matches package.json version
- Add CI badge to README
- Add full test coverage for apiTransformers, displayName, and getRelativeDate utilities
- Add ReviewCardReviewer tests covering initial mapping and image error fallback

## [1.0.1] - 2026-06-XX

### Initial Release - Svelte Conversion

This is the first stable release of **svelte-google-reviews**, a complete port of the original [react-google-reviews](https://github.com/Featurable/react-google-reviews) component from React to Svelte 5.

### Key Features

- **Full Feature Parity**: All functionality from the React version ported to Svelte with idiomatic patterns
- **No React Dependencies**: Pure Svelte implementation with zero React overhead
- **Component Variants**: Three layout options (Carousel, Grid, Showcase) for flexible display options
- **Multiple Data Sources**: Support for Google Places API and free Featurable API
- **SEO-Ready**: JSON-LD structured data integration for search engine optimization
- **TypeScript Support**: Full TypeScript support throughout the codebase
- **Storybook Documentation**: Interactive component documentation and stories
- **Test Coverage**: Comprehensive Vitest test suite

### Project Setup

- MIT License with original Featurable copyright preserved
- GitHub Actions CI/CD pipeline with linting, formatting, and testing
- Storybook deployment to GitHub Pages
- Pre-commit hooks with Prettier and ESLint
- npm trusted publishing with OIDC
