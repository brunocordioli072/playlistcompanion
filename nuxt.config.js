import { ConfigProvider } from "ant-design-vue";

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "spa",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  env: {
    WORKER_URL_DEV: "http://localhost:8080/prod",
    WORKER_URL_PROD:
      "https://z90gjsb7ua.execute-api.us-east-1.amazonaws.com/prod",
    BRIDGE_URL_DEV: "http://localhost:4000/prod/graphql",
    BRIDGE_URL_PROD:
      "https://ojmfr9w3ea.execute-api.us-east-1.amazonaws.com/prod/graphql"
  },
  head: {
    htmlAttrs: {
      lang: "en"
    },
    titleTemplate: "%s - " + "PlaylistCompanion",
    title: "PlaylistCompanion",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/logo.ico" }]
  },
  /*
   ** Global CSS
   */
  css: ["ant-design-vue/dist/antd.css"],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ["@/plugins/antd-ui", "@/plugins/main"],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/google-analytics", "@nuxtjs/dotenv"],
  googleAnalytics: {
    id: "UA-178423300-1",
    debug: {
      enabled: false,
      sendHitTask: true
    }
  },
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {}
};
