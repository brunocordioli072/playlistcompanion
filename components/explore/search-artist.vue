<template>
  <a-select
    label-in-value
    show-search
    :value="search"
    size="large"
    placeholder="Search anything related to music :)"
    style="width: 50vw; min-width: 270px"
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
        <a-avatar slot="avatar" :src="getImageFromArtist(item)" />
        <b style="margin-left: 10px">{{ item.name }}</b>
        <div v-if="!isMobile">
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
        </div>
      </a-space>
    </a-select-option>
  </a-select>
</template>

<script>
import { graphqlClient } from "../../clients";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      fetchingArtists: false,
      searchTimer: null,
    };
  },
  computed: {
    ...mapGetters({
      isMobile: "client/isMobile",
    }),
    search: {
      get: function () {
        return this.$store.getters["explore/search"];
      },
      set: function (val) {
        this.$store.commit("explore/search", val);
      },
    },
    artists: {
      get: function () {
        return this.$store.getters["explore/artists"];
      },
      set: function (val) {
        this.$store.commit("explore/artists", val);
      },
    },
    searchedArtists: {
      get: function () {
        return this.$store.getters["explore/searchedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/searchedArtists", val);
      },
    },
  },
  methods: {
    handleChange(search) {
      Object.assign(this, {
        search,
      });
    },
    getImageFromArtist(item) {
      return item.images && item.images.length > 0 ? item.images[0].url : "";
    },
    updateSearchedArtist(item) {
      this.searchedArtists = [item];
    },
    async fetchArtists(value) {
      if (value) {
        const enrichQuery = (query) => {
          return (
            query.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []
          ).reduce(function (result, each, n, every) {
            let [key, value] = each.split(":");
            result[key] = value;
            return result;
          }, {});
        };
        const search = async () => {
          try {
            let params = enrichQuery(value);
            let res;
            let artistSubFields = {
              id: true,
              name: true,
              genres: true,
              popularity: true,
              images: { url: true },
              followers: { total: true },
              external_urls: { spotify: true },
            };
            if (!params.artist && !params.track) {
              res = await graphqlClient().query({
                artists: [{ query: value }, artistSubFields],
              });
            } else if (params.artist) {
              res = await graphqlClient().query({
                artists: [{ name: params.artist }, artistSubFields],
              });
            } else if (params.track) {
              res = await graphqlClient().query({
                artists: [{ track: params.track }, artistSubFields],
              });
            }
            this.artists = res.artists;
          } catch (e) {
            this.$notification.open({
              message: "Error on fetching artists",
              description: `Some error has occured, please try again or refresh the page...`,
              icon: <a-icon type="monitor" style="color: red" />,
            });
          }
        };

        this.artists = [];
        this.fetchingArtists = true;
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(search, 300);
      }
    },
  },
};
</script>

<style>
</style>