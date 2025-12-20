import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/FMC-Typing-speed-test/',
  plugins: [react()],
})
