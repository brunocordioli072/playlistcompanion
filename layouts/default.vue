<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider
      collapsed-width="0"
      :trigger="null"
      v-model="collapsedFormatted"
      :width="200"
      collapsible
    >
      <c-logo style="margin: 10px 0 10px 0" :collapsed="collapsed"></c-logo>
      <a-menu theme="dark" mode="inline">
        <a-menu-item @click="$router.push('/explore')" key="1">
          <a-icon type="compass" />
          <span>Spotify</span>
        </a-menu-item>
        <a-menu-item @click="$router.push('/explore/youtube')" key="1">
          <a-icon type="compass" />
          <span>Youtube</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-button
          v-if="isMobile"
          type="link"
          icon="menu-unfold"
          size="large"
          @click="collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content :style="isMobile ?  'margin: 16px 4px' : 'margin: 16px 16px'">
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
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      collapsed: true,
    };
  },
  computed: {
    collapsedFormatted() {
      return this.isMobile ? this.collapsed : !this.collapsed;
    },
    ...mapGetters({
      access_token: "client/access_token",
      refresh_token: "client/refresh_token",
      isMobile: "client/isMobile",
    }),
  },
  watch: {
    "$router.query": function () {
      this.setAuth();
    },
    isAuthenticated: async function () {
      if (!this.isAuthenticated) {
        this.$router.go("/");
      }
    },
  },
  methods: {
    setAuth() {
      if (this.$route.query) {
        let access_token = this.$route.query.access_token;
        let expires_in = this.$route.query.expires_in;
        let refresh_token = this.$route.query.refresh_token;
        if (access_token)
          this.$store.commit("client/setAccess_token", access_token);
        if (refresh_token)
          this.$store.commit("client/setRefresh_token", access_token);
        if (expires_in)
          this.$store.commit(
            "client/setExpires_in",
            expires_in * 1000 + +moment()
          );
        this.$ga.event({
          eventCategory: "Auth",
          eventAction: "Click",
          eventLabel: "Logged in",
        });
        if (this.$store.getters["isAuthenticated"]) {
          this.$router.push("/explore");
        }
      }
    },
    async refreshToken() {
      let res = await this.$axios.$get(
        `/auth/spotify/refresh_token?
        refresh_token=${this.$store.getters["client/refresh_token"]}`
      );
      this.$store.commit("client/setAccess_token", res.access_token);
      this.$store.commit("client/setExpires_in", 3600 * 1000 + +moment());
      this.$axios.setToken(this.$store.getters["client/access_token"]);
    },
  },
  async mounted() {
    this.$store.commit("client/isMobile", window.innerWidth < 1100);
    this.setAuth();
    this.$axios.setToken(this.$store.getters["client/access_token"]);
    this.$axios.onError(async (error) => {
      if (error.response.status === 401) {
        await this.refreshToken();
        this.$notification.open({
          message: "Error on auth",
          description: `Some error has occured, please try again...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    });
    if (this.expired_token) {
      this.$router.push("/");
    }
    if (this.$route.query.access_token) {
      this.$router.push("/");
    }
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
