<template>
  <div>
    <c-header></c-header>
    <div class="content">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  async mounted() {
    this.setToken();
    this.$axios.setToken(localStorage.getItem("access_token"));
    let expires_in = localStorage.getItem("expires_in");
  },
  methods: {
    setToken() {
      if (this.$route.query) {
        let access_token = this.$route.query.access_token;
        let expires_in = this.$route.query.expires_in;
        let refresh_token = this.$route.query.refresh_token;
        if (access_token) localStorage.setItem("access_token", access_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
        if (expires_in)
          localStorage.setItem("expires_in", parseInt(expires_in) * 1000 + +moment());
        this.$router.push("")
      }
    },
  },
  computed: {
    expired_token() {
      let expires_in = localStorage.getItem("expires_in");
      return parseInt(expires_in) <= +moment();
    },
  },
  watch: {
    "$route.query": function () {
      this.setToken();
    },
    expired_token: async function () {
      if (this.expired_token) {
        let res = await this.$axios.$get("/auth/spotify/refresh_token");
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("expires_in", 3600 * 1000 + +moment());
        this.$axios.setToken(localStorage.getItem("access_token"));
      }
    },
  },
};
</script>

<style>
.content {
  margin-top: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
