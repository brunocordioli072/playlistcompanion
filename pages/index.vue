<template>
  <div class="container">
    <div>
      <a-button type="primary" @click="login">login</a-button>
      <a-button type="primary" @click="getArtists">artists</a-button>
      <a-button type="primary" @click="getMe">me</a-button>
      <a-button type="primary" @click="createPlaylist">create playlist</a-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      window.location.replace("http://localhost:4000/auth/spotify/login");
    },
    async getArtists() {
      let res = await this.$axios.$get("/findByName/bruno");
      let artists = res.body.artists;
      console.log(artists)
    },
    async getMe() {
      let res = await this.$axios.$get("/me");
      console.log(res.body)
    },
    async createPlaylist() {
      let res = await this.$axios.$post("/playlist");
      console.log(res.body)
    }
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
