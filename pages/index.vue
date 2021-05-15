<template>
  <div class="container">
    <a-space direction="vertical">
      <div
        style="max-width: 800px; width: 80vw; font-size: 16px; margin: 0 420px"
      >
        <h2>Do your own playlist!</h2>
        <p>
          For people who have
          <a target="_blank" href="https://www.spotify.com/">spotify</a>,
          <b>PlaylistCompanion</b> is your best friend when the subject is
          music.
          <b>
            It helps you see all your favorite musicians and see all the
            musicians that are related to them!
          </b>
          And based on your choices it creates a playlist with the musics of the
          musicians you chose.
          <b>Its pretty awesome!</b> You just have to click on the login button
          right above login with your spotify account and give it a try!
        </p>
        <a-space direction="vertical">
          <a-button
            v-if="isAuthenticated"
            size="large"
            type="primary"
            id="login"
            @click="$router.push('/explore')"
            >Go explore!</a-button
          >
          <a-button v-else size="large" type="primary" id="login" @click="login"
            >login</a-button
          >
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  methods: {
    async login() {
      try {
        const loginURL = await this.$axios.$get(
            `${process.env.WORKER_URL}/auth/spotify/login`,
        );
        window.location.href = loginURL;
      } catch (e) {
        this.$notification.open({
          message: 'Error on login',
          description: `Some error has occured, please try again or refresh the page...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    },
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['client/expiresIn'] >= +moment();
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  margin-top: 20px;
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
