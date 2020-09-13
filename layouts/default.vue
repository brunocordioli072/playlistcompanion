<template>
  <div>
    <c-header></c-header>
    <div style="min-height: 84.8vh;" class="content">
      <Nuxt />
    </div>
    <c-footer></c-footer>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  async mounted() {
    console.log(this.$store, window.innerWidth);
    this.setAuth();
    this.$axios.setToken(this.$store.getters["client/access_token"]);
    this.$axios.onError(async (error) => {
      if (error.response.status === 401) {
        await this.refreshToken();
        this.$notification.open({
          message: "Error",
          description: `Some error has occured, please try again...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    });
    if (this.expired_token) {
      await this.refreshToken();
    }
    if (this.$route.query) {
      this.$router.push("/");
    }
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
        console.log("this.isAuthenticated", this.isAuthenticated);
        if (this.isAuthenticated) {
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
  computed: {
    ...mapGetters({
      access_token: "client/access_token",
      refresh_token: "client/refresh_token",
      isAuthenticated: "client/isAuthenticated",
    }),
  },
  watch: {
    "$router.query": function () {
      this.setAuth();
    },
    isAuthenticated: async function () {
      if (!this.isAuthenticated && this.refresh_token) {
        await this.refreshToken();
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
.content {
  margin-top: 12vh;
  display: flex;
  justify-content: center;
  text-align: center;
}

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
