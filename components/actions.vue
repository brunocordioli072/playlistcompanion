<template>
  <a-space direction="horizontal">
    <a-icon
      v-show="search"
      :type="'search'"
      :style="{ fontSize: '20px', color: '#1890ff'}"
      @click="updateSearchedArtist(item)"
    />
    <a-divider v-show="search" type="vertical" />
    <a-icon
      :type="!hasArtistOnPlaylist ? 'plus-circle': 'minus-circle'"
      :style="!hasArtistOnPlaylist ? { fontSize: '20px', color: '#1890ff' }: { fontSize: '20px', color: 'red' }"
      @click="!hasArtistOnPlaylist ? addSelectedArtists(item) : removeSelectedArtists(item)"
    />
    <a-divider type="vertical" />
    <a-icon
      v-if="!playerIsLoading"
      :style="!canBePlayed ? { fontSize: '20px', color: 'grey' }: { fontSize: '20px', color: 'green' }"
      :type="'play-circle'"
      @click="!canBePlayed ? playTopTrackByArtist(item) : stopPlayer()"
    />
    <a-icon v-else :type="'loading'" />
    <!-- <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <a-icon type="down" />
    </a>-->
  </a-space>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    item: Object,
    search: Boolean,
  },
  data() {
    return {
      source: null,
    };
  },
  methods: {
    async playTopTrackByArtist(item) {
      this.playerIsPlaying = false;
      let res = await this.$axios.$get(`/api/spotify/topTrack/${item.id}`);
      let tracks = res.body.tracks;
      this.source = tracks[0].preview_url;
      this.$store.commit("explore/playerSource", tracks[0].preview_url);
      this.playerIsPlaying = true;
    },
    removeSelectedArtists(item) {
      this.selectedArtists = this.selectedArtists.filter((a) => a != item);
    },
    stopPlayer() {
      this.$store.commit("explore/playerIsPlaying", false);
    },
    updateSearchedArtist(item) {
      this.searchedArtists = [item];
    },
    addSelectedArtists(item) {
      this.$store.commit("explore/addSelectedArtist", item);
    },
  },
  computed: {
    ...mapGetters({
      selectedArtistsNames: "explore/selectedArtistsNames",
      playerIsPlaying: "explore/playerIsPlaying",
      playerIsLoading: "explore/playerIsLoading",
      playerSource: "explore/playerSource",
    }),
    canBePlayed() {
      return this.source == this.playerSource && this.playerIsPlaying;
    },
    hasArtistOnPlaylist() {
      return this.selectedArtistsNames.includes(this.item.name);
    },
    searchedArtists: {
      get: function () {
        return this.$store.getters["explore/searchedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/searchedArtists", val);
      },
    },
    selectedArtists: {
      get: function () {
        return this.$store.getters["explore/selectedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/selectedArtists", val);
      },
    },
    playerIsPlaying: {
      get: function () {
        return this.$store.getters["explore/playerIsPlaying"];
      },
      set: function (val) {
        this.$store.commit("explore/playerIsPlaying", val);
      },
    },
  },
  watch: {
    playerIsLoading() {
      console.log(this.playerIsLoading);
    },
  },
};
</script>

<style>
</style>