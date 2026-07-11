import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    globals: true,
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
          coverage: {
            provider: 'v8',
            include: ['src/lib/**/*.{ts,svelte}'],
            exclude: ['src/lib/index.ts'],
            reporter: ['text', 'html'],
            thresholds: {
              lines: 80,
              functions: 80,
              branches: 70,
              statements: 80,
            },
          },
        },
      },
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
    ],
  },
});
