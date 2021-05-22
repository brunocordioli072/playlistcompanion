/* eslint-disable require-jsdoc */
import Vue from 'vue';
import moment from 'moment';
import axios from 'axios';

const auth = new (class Auth extends Vue.extend({
  data: () => ({
    authenticated: false,
  }),
  computed: {
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
    'authenticated': {
      async handler() {
        if (!this.authenticated) {
          this.$notification['info']({
            message: 'Session Expired',
            description: `Some error has occured, please try again or refresh the page...`,
          });
        }
      },
    },
  },
  methods: {
    getAccessToken() {
      return localStorage.getItem('access_token') || '';
    },
    setAccessToken(accessToken: string) {
      localStorage.setItem('access_token', accessToken);
    },
    getExpiresAt() {
      return parseInt(localStorage.getItem('expires_at') || '');
    },
    setExpiresAt(expiresIn: number) {
      const expiresAt = JSON.stringify(
          expiresIn * 1000 + new Date().getTime(),
      );
      localStorage.setItem('expires_at', expiresAt);
    },
    getVuexExpiresAt() {
      return parseInt(sessionStorage.getItem('vuex_expires_at') || '');
    },
    setVuexExpiresAt(expiresIn: number) {
      const expiresAt = JSON.stringify(
          expiresIn * 1000 + new Date().getTime(),
      );
      sessionStorage.setItem('vuex_expires_at', expiresAt);
    },
    async checkVuex() {
      if (this.getVuexExpiresAt() <= new Date().getTime()) {
        this.setVuexExpiresAt(24 * 60);
      }
    },
    expirationDate() {
      return this.getExpiresAt() - +moment();
    },

    async login() {
      const {data} = await axios.get(
          `${process.env.WORKER_URL}/spotify/login?redirect_uri=${window.location.origin}${window.location.pathname}`,
      );
      window.location.href = data;
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expires_at');
      sessionStorage.removeItem('vuex_expires_at');
    },
    isAuthenticated() {
      return new Date().getTime() < this.getExpiresAt() || 0;
    },
    async handleAuthentication(code: any) {
      const res = await axios.get(
          `${process.env.WORKER_URL}/spotify/credentials?code=${code}&redirect_uri=${window.location.origin}${window.location.pathname}`,
      );
      const authResult = res.data.body;
      if (authResult && authResult.access_token) {
        this.setExpiresAt(authResult.expires_in || 1);
        this.setVuexExpiresAt(24 * 60);
        this.setAccessToken(authResult.access_token);
        this.authenticated = true;
      }
    },
    initSession() {
      if (this.isAuthenticated()) this.authenticated = true;
      setTimeout(this.refreshTokens, this.expirationDate() || 5000);
    },
    async refreshTokens() {
      if (!this.isAuthenticated()) {
        this.authenticated = false;
      }
      setTimeout(this.refreshTokens, this.expirationDate() || 30000);
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
