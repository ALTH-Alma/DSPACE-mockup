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
});
