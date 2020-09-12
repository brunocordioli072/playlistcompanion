<template>
  <div>
    <c-header></c-header>
    <div style="min-height: 84.8vh" class="content">
      <Nuxt />
    </div>
    <c-footer></c-footer>
  </div>
</template>

<script>
import moment from "moment";
export default {
  async mounted() {
    this.setToken();
    console.log(this.access_token);
    this.$axios.setToken(localStorage.getItem("access_token"));
    let expires_in = localStorage.getItem("expires_in");
    this.$axios.onError(async (error) => {
      if (error.response.status === 401) {
        await this.refresh_token();
        this.$notification.open({
          message: "Error",
          description: `Some error has occured, please try again...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    });
    if (this.expired_token) {
      await this.refresh_token();
    }
    if (this.access_token) {
      this.$router.push("/explore");
    } else if (!this.access_token) {
      this.$router.push("/");
    }
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
          localStorage.setItem("expires_in", expires_in * 1000 + +moment());
        console.log("to aqui");
        this.$router.push("/explore");
      }
    },
    async refresh_token() {
      let res = await this.$axios.$get(
        `/auth/spotify/refresh_token?refresh_token=${localStorage.getItem(
          "refresh_token"
        )}`
      );
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("expires_in", 3600 * 1000 + +moment());
      this.$axios.setToken(localStorage.getItem("access_token"));
    },
  },
  computed: {
    expired_token() {
      let expires_in = localStorage.getItem("expires_in");
      return parseInt(expires_in) <= +moment();
    },
    access_token() {
      return localStorage.getItem("access_token");
    },
  },
  watch: {
    "$router.query": function () {
      this.setToken();
    },
    access_token: function () {
      if (this.access_token) {
        this.$router.push("/explore");
      } else {
        this.$router.push("");
      }
    },
    expired_token: async function () {
      if (this.expired_token) {
        await this.refresh_token();
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
