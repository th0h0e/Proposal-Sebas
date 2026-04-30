import { defineConfig } from 'nitro'

export default defineConfig({
  serverDir: './server',

  storage: {
    org: {
      driver: 'fs',
      base: './.data/org',
    },
  },

  devStorage: {
    org: {
      driver: 'fs',
      base: './.data/org',
    },
  },

  devServer: {
    port: 3001,
  },

  compatibilityDate: '2026-03-27',
})
