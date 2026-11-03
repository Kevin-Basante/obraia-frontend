import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      // Logic of the app: calls to the backend, helpers and settings.
      include: ['src/services/**', 'src/utils/**', 'src/config/**'],
      exclude: ['**/*.test.{js,jsx}'],
      reporter: ['text-summary', 'html'],
    },
  },
})
