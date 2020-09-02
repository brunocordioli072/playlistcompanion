<template>
  <div class="container">
    <div>
      <a-button type="primary" @click="login">login</a-button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.setToken();
    console.log(localStorage.getItem("access_token"))
    console.log(localStorage.getItem("refresh_token"))
  },
  methods: {
    login() {
      window.location.replace("http://localhost:4000/api/spotify/login");
    },
    setToken() {
      if (this.$route.query) {
        let access_token = this.$route.query.access_token;
        let refresh_token = this.$route.query.refresh_token;
        if (access_token) localStorage.setItem("access_token", access_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
      }
    },
  },
  watch: {
    "$route.query": function () {
      this.setToken();
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
