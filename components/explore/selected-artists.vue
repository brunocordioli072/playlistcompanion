<template>
  <a-list
    style="width: 81vw"
    :grid="{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }"
    :data-source="selectedArtists"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card>
        <div slot="title">
          <a-space direction="vertical">
            <a-avatar slot="avatar" :src="getImageFromArtist(item)" />
            <div>{{ item.name }}</div>
          </a-space>
        </div>
        <a-space direction="vertical">
          <div>
            <a-tag class="tag" :color="'purple'"
              >Followers:
              {{ numberToLocaleFormat(item.followers.total) }}</a-tag
            >
            <a-tag class="tag" :color="'blue'"
              >Popularity: {{ item.popularity }}</a-tag
            >
          </div>
          <div>
            <a-button
              size="small"
              type="primary"
              @click="updateSearchedArtist(item)"
              >Search</a-button
            >
            <a-button
              style="margin: 5px"
              size="small"
              type="dashed"
              :color="'red'"
              @click="removeSelectedArtists(item)"
              >Remove</a-button
            >
          </div>
        </a-space>
      </a-card>
    </a-list-item>
  </a-list>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {};
  },
  computed: {
    selectedArtists: {
      get(): any {
        return this.$store.getters['explore/selectedArtists'];
      },
      set(val: any): void {
        this.$store.commit('explore/selectedArtists', val);
      },
    },
    searchedArtists: {
      get(): any {
        return this.$store.getters['explore/searchedArtists'];
      },
      set(val: any): void {
        this.$store.commit('explore/searchedArtists', val);
      },
    },
  },
  methods: {
    getImageFromArtist(item: { images: string|any[]; }) {
      return item.images && item.images.length > 0 ? item.images[0].url : '';
    },
    numberToLocaleFormat(number: number) {
      return parseFloat(number.toFixed(0)).toLocaleString('pt-br', {
        minimumFractionDigits: 0,
      });
    },
    updateSearchedArtist(item: any) {
      this.searchedArtists = [item];
    },
    removeSelectedArtists(item: any) {
      this.selectedArtists = this.selectedArtists.filter((a: any) => a != item);
    },
  },
});
</script>

<style>
</style>
