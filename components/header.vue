<template>
  <a-layout-header>
    <div class="logo">
      <a-button @click="$router.push('/')" type="link" ghost>
        <span id="playlist">Playlist</span>
        <span id="companion">Companion</span>
      </a-button>
    </div>
    <a-menu
      theme="dark"
      mode="horizontal"
      :default-selected-keys="['4']"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item v-show="access_token" @click="$router.push('/explore')">explore</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ access_token: "client/access_token" }),
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
#playlist {
  font-size: 20px;
  font-weight: 200;
  font-family: "Kanit", sans-serif;
}
#companion {
  font-size: 20px;
  margin: 0 0 0 0px;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
}
</style>