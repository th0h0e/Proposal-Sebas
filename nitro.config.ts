import { defineConfig } from 'nitro'

export default defineConfig({
  preset: 'cloudflare_module',
  compatibilityDate: '2026-03-27',

  serverDir: './server',

  storage: {
    org: {
      driver: 'cloudflare-kv-binding',
      binding: 'ORG_KV',
    },
  },

  devStorage: {
    org: {
      driver: 'fs',
      base: './.data/org',
    },
  },

  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: {
      name: 'superkids-org',
      kv_namespaces: [
        {
          binding: 'ORG_KV',
          id: '198d1d5718a249a99f13ab2fe6f9c68f',
        },
      ],
    },
  },

  devServer: {
    port: 3001,
  },
})
