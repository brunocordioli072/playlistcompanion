<template>
  <a-layout-sider
    collapsed-width="0"
    :trigger="null"
    v-model="collapsed"
    :width="200"
    collapsible
  >
    <Logo
      :style="{ margin: '10px 0 10px 0', minWidth: '300px' }"
      :collapsed="collapsed"
    ></Logo>
    <a-menu theme="dark" mode="inline">
      <a-menu-item @click="$router.push('/explore')" key="1">
        <a-icon type="compass" />
        <span>Explore</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    collapsed: {
      get: function() {
        return this.$store.getters['layout/collapsed'];
      },
      set: function(val) {
        this.$store.commit('layout/collapsed', val);
      },
    },
  },
});
</script>
