import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  css: {
    lightningcss: {
      // The original stylesheet contains the IE-only `*zoom` star hack.
      // Keep it byte-identical and let LightningCSS strip the invalid declaration.
      errorRecovery: true,
    },
  },
})
