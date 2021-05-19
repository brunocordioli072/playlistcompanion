/* eslint-disable require-jsdoc */
import Vue from 'vue';
import moment from 'moment';
import axios from 'axios';

const auth = new (class Auth extends Vue.extend({
  data: () => ({
    authenticated: false,
  }),
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
    async checkVuex() {
      if (this.vuexExpiresAt <= new Date().getTime()) {
        this.vuexExpiresAt = 24 * 60;
      }
    },
    expirationDate() {
      return this.expiresAt - +moment();
    },

    async login() {
      const {data} = await axios.get(
          `${process.env.WORKER_URL}/spotify/login`,
      );
      window.location.href = data;
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expires_at');
      sessionStorage.removeItem('vuex_expires_at');
    },
    isAuthenticated() {
      return new Date().getTime() < this.expiresAt || 0;
    },
    async handleAuthentication(code: any) {
      const res = await axios.get(
          `${process.env.WORKER_URL}/spotify/credentials?code=${code}`,
      );
      const authResult = res.data.body;
      if (authResult && authResult.access_token) {
        this.expiresAt = authResult.expires_in;
        this.vuexExpiresAt = 24 * 60;
        this.accessToken = authResult.access_token;
        this.authenticated = true;
      }
    },
    initSession() {
      console.log( this.expirationDate());
      
      setTimeout(this.refreshTokens, this.expirationDate());
    },
    async refreshTokens() {
      if (true) {
        this.authenticated = false;
      }
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
