export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

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
