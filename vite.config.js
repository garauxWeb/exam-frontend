import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url' // 1. Importa questa utility nativa di Node

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 2. Mappa l'alias @ sulla cartella src del tuo progetto
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
