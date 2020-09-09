<template>
  <a-layout-header>
    <div class="logo">
      <span id="playlist">Playlist</span>
      <span id="companion">Companion</span>
    </div>
    <a-menu
      theme="dark"
      mode="horizontal"
      :default-selected-keys="['4']"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item @click="$router.push('/explore')">explore</a-menu-item>
      <a-menu-item>search</a-menu-item>
    </a-menu>
    <v-spacer></v-spacer>
    <a-button type="primary" id="login" @click="login">login</a-button>
  </a-layout-header>
</template>

<script>
export default {
  methods: {
    login() {
      window.location.replace("http://localhost:4000/auth/spotify/login");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;600&display=swap");

.logo {
  width: 180px;
  height: 31px;
  color: white;
  margin: 0px 24px 16px 0;
  float: left;
}
#login {
  position: relative;
  float: right;
  margin: -49px 24px 16px 0;
}
#playlist {
  font-size: 20px;
  font-weight: 200;
  font-family: "Kanit", sans-serif;
}
#companion {
  font-size: 20px;
  margin: 0 0 0 -5px;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
}
</style>