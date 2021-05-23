/* eslint-disable require-jsdoc */
import Vue from 'vue';
import moment from 'moment';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';

const auth = new (class Auth extends Vue.extend({
  data: () => ({
    authenticated: false,
  }),
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
        this.$spotify.api = new SpotifyWebApi({
          accessToken: localStorage.getItem('access_token') || '',
        });
        if (!this.authenticated && window.location.pathname != '/playlistcompanion/') {
          this.$notification['info']({
            message: 'Session Expired',
            description: `Some error has occured, please try again or refresh the page...`,
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    getAccessToken() {
      return localStorage.getItem('access_token') || '';
    },
    setAccessToken(accessToken: string) {
      localStorage.setItem('access_token', accessToken);
    },
    getRefreshToken() {
      return localStorage.getItem('refresh_token') || '';
    },
    setRefreshToken(refreshToken: string) {
      localStorage.setItem('refresh_token', refreshToken);
    },
    getExpiresAt() {
      return parseInt(localStorage.getItem('expires_at') || '');
    },
    setExpiresAt(expiresIn: number) {
      const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
      localStorage.setItem('expires_at', expiresAt);
    },
    getVuexExpiresAt() {
      return parseInt(sessionStorage.getItem('vuex_expires_at') || '');
    },
    setVuexExpiresAt(expiresIn: number) {
      const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
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
      return new Date().getTime() < this.getExpiresAt();
    },
    async handleAuthentication(code: any) {
      const res = await axios.get(
          `${process.env.WORKER_URL}/spotify/credentials?code=${code}&redirect_uri=${window.location.origin}${window.location.pathname}`,
      );
      const authResult = res.data.body;
      if (authResult && authResult.access_token) {
        this.setupUser(authResult);
      }
    },
    setupUser(authResult: any) {
      this.setExpiresAt(authResult.expires_in || 1);
      this.setVuexExpiresAt(24 * 60);
      this.setAccessToken(authResult.access_token);
      if (authResult.refresh_token) {
        this.setRefreshToken(authResult.refresh_token);
      }
      this.authenticated = true;
    },
    initSession() {
      if (this.isAuthenticated()) this.authenticated = true;
      setTimeout(this.refreshTokens, 300000);
    },
    async refreshTokens() {
      if (!this.isAuthenticated()) {
        this.authenticated = false;
      }
      const res = await axios.get(
          `${
            process.env.WORKER_URL
          }/spotify/credentials/refresh?refresh_token=${this.getRefreshToken()}`,
      );
      this.setupUser(res.data.body);
      setTimeout(this.refreshTokens, 300000);
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
