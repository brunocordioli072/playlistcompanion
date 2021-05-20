<template>
  <a-select
    label-in-value
    show-search
    :value="search"
    size="large"
    placeholder="Search anything related to music :)"
    style="width: 40vw; min-width: 270px"
    :filter-option="false"
    :not-found-content="fetchingArtists ? undefined : null"
    @search="fetchArtists"
    @change="handleChange"
  >
    <a-spin v-if="fetchingArtists" slot="notFoundContent" size="small" />
    <a-select-option
      v-for="(item, index) in artists"
      :key="index"
      @click="updateSearchedArtist(item)"
    >
      <a-space direction="horizontal">
        <a-avatar slot="avatar" :size="30" :src="getImageFromArtist(item)" />
        <b style="margin-left: 10px">{{ item.name }}</b>
        <a-tag
          style="margin-left: 5px"
          v-for="genre in item.genres"
          :key="genre"
          :color="
            genre === 'loser'
              ? 'volcano'
              : genre.length > 5
              ? 'geekblue'
              : 'green'
          "
          >{{ genre.toUpperCase() }}</a-tag
        >
      </a-space>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      fetchingArtists: false,
      searchTimer: 0,
    };
  },
  computed: {
    search: {
      get(): any {
        return this.$store.getters['explore/search'];
      },
      set(val: any): void {
        this.$store.commit('explore/search', val);
      },
    },
    artists: {
      get(): any {
        return this.$store.getters['explore/artists'];
      },
      set(val: any): void {
        this.$store.commit('explore/artists', val);
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
    handleChange(search: any) {
      Object.assign(this, {
        search,
      });
    },
    getImageFromArtist(item: { images: string|any[]; }) {
      return item.images && item.images.length > 0 ? item.images[0].url : '';
    },
    updateSearchedArtist(item: any) {
      this.searchedArtists = [item];
    },
    async fetchArtists(value: string) {
      if (value) {
        const enrichQuery = (query: string) => {
          return (
            query.match(new RegExp('([^?=&]+)(=([^&]*))?', 'g')) || []
          ).reduce(function(result: any, each: any, n: any, every: any) {
            const [key, value] = each.split(':');
            result[key] = value;
            return result;
          }, {});
        };
        const search = async () => {
          try {
            const params = enrichQuery(value);
            let res: SpotifyApi.SearchResponse = {};
            if (params.artist) {
              res = (await this.$spotify.api.search(params.artist, ['artist'], {
                limit: 10,
              })).body;
            } else if (params.track) {
              res = (await this.$spotify.api.search(params.track, ['track'], {
                limit: 10,
              })).body;
            } else {
              res = (await this.$spotify.api.search(value, ['artist', 'track'], {
                limit: 10,
              })).body;
            }
            this.artists = res?.artists?.items;
          } catch (e) {
            this.$notification['info']({
              message: 'Error on fetching artists',
              description: `Some error has occured, please try again or refresh the page...`,
            });
          }
        };

        this.artists = [];
        this.fetchingArtists = true;
        await search();
      }
    },
  },
});
</script>

<style></style>
