import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // this sends all local requests to my Express-backend during development
      '/recipes': 'http://localhost:3000',
      '/allergens': 'http://localhost:3000',
    },
  },
});
