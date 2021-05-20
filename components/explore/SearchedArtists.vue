<template>
  <a-list
    style="width: 81vw"
    v-if="searchedArtists.length > 0"
    item-layout="horizontal"
    :data-source="searchedArtists"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta>
        <div slot="title">
          <b>Selected:</b>
          <a target="_blank" :href="item.external_urls.spotify">{{
            item.name
          }}</a>
        </div>
        <div slot="description">
          <a-tag
            class="tag"
            v-for="genre in item.genres"
            :key="genre"
            :color="
              genre.length < 5
                ? 'volcano'
                : genre.length > 5
                ? 'violet'
                : 'green'
            "
            >{{ genre.toUpperCase() }}</a-tag
          >
          <a-tag class="tag" :color="'purple'"
            >Followers: {{ numberToLocaleFormat(item.followers.total) }}</a-tag
          >
          <a-tag class="tag" :color="'blue'"
            >Popularity: {{ item.popularity }}</a-tag
          >
        </div>
        <a-avatar
          :size="64"
          style="margin-left: 20px"
          slot="avatar"
          :src="getImageFromArtist(item)"
        />
      </a-list-item-meta>
      <div style="margin: 5px" slot="actions">
        <Actions :search="false" :item="item"></Actions>
      </div>
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
    numberToLocaleFormat(number: number) {
      return parseFloat(number.toFixed(0)).toLocaleString('pt-br', {
        minimumFractionDigits: 0,
      });
    },
    getImageFromArtist(item: { images: string|any[]; }) {
      return item.images && item.images.length > 0 ? item.images[0].url : '';
    },
  },
});
</script>

<style>
</style>
