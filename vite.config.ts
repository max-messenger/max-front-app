import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Отчёт о размере бандла: npm run analyze → stats.html
    ...(mode === 'analyze'
      ? [visualizer({
        filename: 'stats.html',
        template: 'treemap',
        gzipSize: true
      })]
      : [])
  ],
  resolve: {
    tsconfigPaths: true
  }
}))
