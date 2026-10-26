import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', strictPort: true },
  preview: {
    host: '0.0.0.0', strictPort: true,
    allowedHosts: process.env.PORTFOLIO_PREVIEW_HOST ? [process.env.PORTFOLIO_PREVIEW_HOST] : [],
  },
});
