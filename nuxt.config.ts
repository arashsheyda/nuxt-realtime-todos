export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  modules: [
    '@nuxt/ui',
    'nuxt-ngrok',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  ngrok: {
    authtoken_from_env: true,
    domain: 'mutual-moose-generous.ngrok-free.app',
  },

  ui: {
    icons: [
      'ph',
      'simple-icons',
    ],
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },
})
