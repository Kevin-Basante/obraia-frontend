import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // The texts in English and Spanish go in a file of their own, so the code of the app stays small.
        codeSplitting: {
          groups: [{ name: 'texts', test: /src[\\/]i18n[\\/].+\.json$/ }],
        },
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      // Logic of the app: calls to the backend, helpers, settings and texts.
      include: ['src/services/**', 'src/utils/**', 'src/config/**', 'src/i18n/**'],
      exclude: ['**/*.test.{js,jsx}'],
      reporter: ['text-summary', 'html'],
      // npm run coverage fails if the coverage drops below these values.
      thresholds: { lines: 95, functions: 95, branches: 90, statements: 95 },
    },
  },
})
