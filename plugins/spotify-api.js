/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import Vue from 'vue';
import SpotifyWebApi from 'spotify-web-api-node';

export default function() {
  const spotify = new Vue({
    data() {
      return {
        api: null,
      };
    },
    computed: {
      accessToken: {
        get() {
          return localStorage.getItem('access_token');
        },
        set(accessToken) {
          localStorage.setItem('access_token', accessToken);
        },
      },
    },
    watch: {
      accessToken: {
        handler() {
          this.api = new SpotifyWebApi({
            accessToken: this.accessToken,
          });
        },
        immediate: true,
      },
    },
  });
  Vue.prototype.$spotify = spotify;
}
