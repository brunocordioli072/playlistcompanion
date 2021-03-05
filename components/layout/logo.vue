<template>
  <a-space>
    <div>
      <img style="width: 24px" src="~/assets/logo.png" />
      <a-button style="padding: 0" @click="$router.push('/')" type="link" ghost>
        <span id="playlist">Playlist</span>
        <span id="companion">Companion</span>
      </a-button>
    </div>
  </a-space>
</template>

<script>
export default {
  props: {
    collapsed: Boolean,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;600&display=swap");

.logo {
  color: white;
  float: left;
}
#playlist {
  font-size: 18px;
  font-weight: 200;
  font-family: "Kanit", sans-serif;
}
#companion {
  font-size: 18px;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
}
</style>