<template>
  <div class="container">
    <a-space direction="vertical">
      <div style="max-width: 800px; width: 80vw; font-size: 16px">
        <h2>Do your own playlist!</h2>
        <p>
          For people who have
          <a target="_blank" href="https://www.spotify.com/">spotify</a>,
          <b>PlaylistCompanion</b> is your
          best friend when the subject is music.
          <b>
            It helps you see all your
            favorite musicians and see all the musicians that are related to them!
          </b>
          And based on your choices it creates a playlist with the musics of the musicians
          you chose.
          <a>Its pretty awesome!</a> You just have to click on the login button
          right above login with your spotify account and give it a try!
        </p>
        <a-button size="large" type="primary" id="login" @click="login">login</a-button>
      </div>
    </a-space>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      window.location.replace(`${this.$axios.defaults.baseURL}/auth/spotify/login`);
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  height: 300px;
  min-height: 30vh;
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
