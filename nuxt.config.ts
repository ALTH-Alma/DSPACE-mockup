export default defineNuxtConfig({

  devtools: { enabled: true },

  css: [
    'bootstrap/dist/css/bootstrap.css',
  ],

  plugins: ["~/plugins/axios"],
  imports: {
    dirs: ['stores'],
  },
  components: true,
  runtimeConfig: {
    public: {
      API_BASE_URL: 'http://localhost:8080/server/api',
    }
  },
  security: {
    rateLimiter: {
        value: {
            tokensPerInterval: 150,
            interval: 'hour',
            fireImmediately: false,
        },
        route: '/**',
    },
    headers: {
        contentSecurityPolicy: {
    'img-src': ['*', 'data:', 'blob:'],
        },
        crossOriginEmbedderPolicy: {
            value: 'unsafe-none',
            route: '/**',
        },
    },
    allowedMethodsRestricter: {
        value: ['GET', 'POST', 'DELETE', 'PUT'],
        route: '/**',
    },
  },

});
