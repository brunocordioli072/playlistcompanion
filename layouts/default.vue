<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <c-sider></c-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-button
          type="link"
          icon="menu-unfold"
          size="large"
          @click="collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content
        :style="'margin: 16px 16px'"
      >
        <div
          :style="{ padding: '20px', background: '#fff', minHeight: '360px' }"
        >
          <Nuxt />
        </div>
      </a-layout-content>
      <c-footer></c-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  middleware: 'routes',
  computed: {
    isAuthenticated() {
      return this.$auth.authenticated;
    },
  },
  watch: {
    isAuthenticated() {
      if (!this.isAuthenticated) {
        this.$router.push('/');
      } else {
        this.$auth.initSession();
      }
    },
  },
});
</script>

<style>
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
