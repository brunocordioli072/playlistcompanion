<template>
  <a-layout-header :style="{ textAlign: 'center' }">
    <a-space direction="horizontal">
      <img style="width: 50px" src="~/assets/logo.png" />
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
        <a-menu-item v-show="accessToken" @click="$router.push('/explore')">explore</a-menu-item>
      </a-menu>
    </a-space>
  </a-layout-header>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters({
      accessToken: 'client/accessToken',
    }),
  },
};
</script>
