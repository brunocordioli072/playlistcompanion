import { ConfigProvider } from "ant-design-vue";
import keywords from "./assets/keywords.json"
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
  target: "static",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  router: {
    base: '/companion-explorer/'
  },
  head: {
    htmlAttrs: {
      lang: "en"
    },
    titleTemplate: "%s",
    title: "PlaylistCompanion",
    meta: [
      { name: "keywords", content: keywords.join(",")},
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/companion-explorer/logo.ico" }]
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
  env: {
    WORKER_URL: process.env.WORKER_URL ? process.env.WORKER_URL : "https://rqt6sty8u4.execute-api.us-east-1.amazonaws.com/prod",
    BRIDGE_URL: process.env.BRIDGE_URL ? process.env.BRIDGE_URL : "https://5v3pwv399f.execute-api.us-east-1.amazonaws.com/prod/graphql",
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
