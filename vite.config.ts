import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const isCI = !!process.env.CI;

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src/lib/**/*.{ts,svelte}'],
      exclude: ['src/lib/index.ts'],
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 68,
        statements: 80,
      },
    },
    projects: [
      {
        plugins: [svelte()],
        resolve: { conditions: ['browser'] },
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/tests/setup.ts'],
          include: ['src/tests/**/*.test.ts'],
        },
      },
      // Storybook browser tests require a Playwright browser install.
      // Skip in CI where browsers are not available.
      ...(!isCI
        ? [
            {
              plugins: [svelte(), storybookTest({ configDir: '.storybook' })],
              resolve: { conditions: ['browser'] },
              test: {
                name: 'storybook',
                browser: {
                  enabled: true,
                  headless: true,
                  provider: playwright(),
                  instances: [{ browser: 'chromium' }],
                },
              },
            },
          ]
        : []),
    ],
  },
});
