/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import Vue from 'vue';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyAPI = new class extends Vue.extend({
  data: () => ({
    api: new SpotifyWebApi(),
  }),
  computed: {
    authenticated() {
      return this.$auth.authenticated;
    },
  },
  watch: {
    authenticated: {
      handler() {
        this.api = new SpotifyWebApi({
          accessToken: localStorage.getItem('access_token') || '',
        });
      },
      immediate: true,
    },
  },
}) {};

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    $spotify: typeof spotifyAPI;
  }
}

Vue.prototype.$spotify = spotifyAPI;
