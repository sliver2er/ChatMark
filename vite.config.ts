// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    AutoImport({
      imports: [
        'react',
      ],
      dirs: [
        'src/scripts/features/Sidebar/config',
      ],
      dts: 'src/auto-imports.d.ts',
      viteOptimizeDeps: true,
      include: [
        /\.[tj]sx?$/,
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    cors: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

