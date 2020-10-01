import Vue from "vue";
import "../components";

let isDev = process.env.NODE_ENV !== "production";
let WORKER_URL = isDev ? process.env.WORKER_URL_DEV : process.env.WORKER_URL_PROD;
process.env.WORKER_URL = WORKER_URL;

import VuePlyr from "vue-plyr/dist/vue-plyr.ssr.js";
Vue.use(VuePlyr);
