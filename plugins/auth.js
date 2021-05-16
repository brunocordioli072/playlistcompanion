/* eslint-disable require-jsdoc */
import Vue from 'vue';
import moment from 'moment';

export default function({$axios, route, app}) {
  const auth = new Vue({
    computed: {
      accessToken: {
        get() {
          return localStorage.getItem('access_token');
        },
        set(accessToken) {
          localStorage.setItem('access_token', accessToken);
        },
      },
      expiresAt: {
        get() {
          return localStorage.getItem('expires_at');
        },
        set(expiresIn) {
          const expiresAt = JSON.stringify(
              expiresIn * 1000 + new Date().getTime(),
          );
          localStorage.setItem('expires_at', expiresAt);
        },
      },
      vuexExpiresAt: {
        get() {
          return sessionStorage.getItem('vuex_expires_at');
        },
        set(expiresIn) {
          const expiresAt = JSON.stringify(
              expiresIn * 1000 + new Date().getTime(),
          );
          sessionStorage.setItem('vuex_expires_at', expiresAt);
        },
      },
    },
    watch: {
      'route.query.code': {
        async handler() {
          if (route.query.code) {
            await this.handleAuthentication(route.query.code);
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
        return this.expiresAt - +moment();
      },

      async login() {
        const loginURL = await $axios.$get(
            `${process.env.WORKER_URL}/auth/spotify/login`,
        );
        window.location.href = loginURL;
      },
      logout() {
        return new Promise(async (resolve, reject) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('expires_at');
          sessionStorage.removeItem('vuex_expires_at');
        });
      },
      isAuthenticated() {
        return new Date().getTime() < this.expiresAt;
      },
      async handleAuthentication(code) {
        const res = await $axios.$get(
            `${process.env.WORKER_URL}/auth/spotify/credentials?code=${code}`,
        );
        const authResult = res.body;
        if (authResult && authResult.access_token) {
          this.expiresAt = authResult.expires_in;
          this.vuexExpiresAt = 24 * 60;
          this.accessToken = authResult.access_token;
        }
      },
      initSession() {
        return new Promise((resolve) => {
          setTimeout(this.refreshTokens, this.expirationDate());
        });
      },
      async refreshTokens() {
        if (!this.isAuthenticated()) {
          await this.login();
        }
        setTimeout(this.refreshTokens, this.expirationDate());
      },
    },
  });
  Vue.prototype.$auth = auth;
}
