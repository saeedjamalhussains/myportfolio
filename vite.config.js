import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
  // so every asset URL needs that prefix. If the repo is ever renamed to
  // saeedjamalhussains.github.io (a user site, served at the domain root),
  // change this back to '/'.
  base: '/myportfolio/',
  plugins: [react()],
})
