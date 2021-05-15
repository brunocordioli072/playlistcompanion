<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <c-sider></c-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-button
          type="link"
          icon="menu-unfold"
          size="large"
          @click="collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content
        :style="'margin: 16px 16px'"
      >
        <div
          :style="{ padding: '20px', background: '#fff', minHeight: '360px' }"
        >
          <Nuxt />
        </div>
      </a-layout-content>
      <c-footer></c-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import moment from 'moment';

export default {
  middleware: 'routes',
  computed: {
    collapsed: {
      get: function() {
        return this.$store.getters['layout/collapsed'];
      },
      set: function(val) {
        this.$store.commit('layout/collapsed', val);
      },
    },
    isAuthenticated() {
      return this.$store.getters['client/expiresIn'] >= +moment();
    },
  },
  watch: {
    '$route.query.code': {
      async handler() {
        if (this.$route.query.code) {
          this.setAuth(this.$route.query.code);
        }
      },
      immediate: true,
    },
  },
  methods: {
    async setAuth(code) {
      const res = await this.$axios.$get(
          `${process.env.WORKER_URL}/auth/spotify/credentials?code=${code}`,
      );
      if (res.statusCode == 200) {
        const data = res.body;
        this.$store.commit('client/accessToken', data.access_token);
        this.$store.commit('client/refreshToken', data.access_token);
        this.$store.commit(
            'client/expiresIn',
            +moment().add(data.expires_in, 'seconds'),
        );
      }
    },
  },
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
