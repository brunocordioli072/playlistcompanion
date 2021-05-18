/* eslint-disable require-jsdoc */
import Vue from 'vue';
import moment from 'moment';
import axios from 'axios';

const auth = new (class Auth extends Vue.extend({
  computed: {
    accessToken: {
      get() {
        return localStorage.getItem('access_token') || '';
      },
      set(accessToken: string) {
        localStorage.setItem('access_token', accessToken);
      },
    },
    expiresAt: {
      get() {
        return parseInt(localStorage.getItem('expires_at') || '');
      },
      set(expiresIn: number) {
        const expiresAt = JSON.stringify(
            expiresIn * 1000 + new Date().getTime(),
        );
        localStorage.setItem('expires_at', expiresAt);
      },
    },
    vuexExpiresAt: {
      get() {
        return parseInt(sessionStorage.getItem('vuex_expires_at') || '');
      },
      set(expiresIn: number) {
        const expiresAt = JSON.stringify(
            expiresIn * 1000 + new Date().getTime(),
        );
        sessionStorage.setItem('vuex_expires_at', expiresAt);
      },
    },
  },
  watch: {
    'window.location.search': {
      async handler() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('code')) {
          await this.handleAuthentication(urlParams.get('code'));
        }
      },
      immediate: true,
    },
  },
  methods: {
    async checkVuex() {
      if (this.vuexExpiresAt <= new Date().getTime()) {
        this.vuexExpiresAt = 24 * 60;
      }
    },
    expirationDate() {
      return this.expiresAt || 0 - +moment();
    },

    async login() {
      const {data} = await axios.get(
          `${process.env.WORKER_URL}/auth/spotify/login`,
      );
      window.location.href = data;
    },
    logout() {
      return new Promise(async (resolve, reject) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        sessionStorage.removeItem('vuex_expires_at');
      });
    },
    isAuthenticated() {
      return new Date().getTime() < this.expiresAt || 0;
    },
    async handleAuthentication(code: any) {
      const res = await axios.get(
          `${process.env.WORKER_URL}/auth/spotify/credentials?code=${code}`,
      );
      const authResult = res.data.body;
      if (authResult && authResult.access_token) {
        this.expiresAt = authResult.expires_in;
        this.vuexExpiresAt = 24 * 60;
        this.accessToken = authResult.access_token;
      }
    },
    initSession() {
      return new Promise((resolve) => {
        if (this.isAuthenticated()) {
          setTimeout(this.refreshTokens, this.expirationDate());
        }
      });
    },
    async refreshTokens() {
      if (!this.isAuthenticated()) {
        await this.login();
      }
      setTimeout(this.refreshTokens, this.expirationDate());
    },
  },
}) {})();

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    $auth: typeof auth;
  }
}

Vue.prototype.$auth = auth;
