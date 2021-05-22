/* eslint-disable require-jsdoc */
import Vue from 'vue';

const app = new (class App extends Vue.extend({
  data: () => ({
    width: 1100,
    isMobile: false,
  }),

  watch: {
    'window.innerWidth': {
      async handler() {
        this.width = window.innerWidth;
        if (this.width < 1000) this.isMobile = true;
      },
      immediate: true,
    },
  },
}) {})();

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    $app: typeof app;
  }
}

Vue.prototype.$app = app;
