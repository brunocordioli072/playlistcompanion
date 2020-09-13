<template>
  <a-space direction="horizontal">
    <a @click="addSelectedArtists(item)">
      Add to
      <b>playlist</b>
    </a>
    <a-divider v-show="search" type="vertical" />
    <a v-show="search" @click="updateSearchedArtist(item)">Search</a>
    <a-divider type="vertical" />
    <a-icon
      v-if="source == playerSource && isPlaying"
      style="color: green"
      type="play-circle"
      @click="stopPlayer"
    />
    <a-icon v-else style="color: grey" type="play-circle" @click="playTopTrackByArtist(item)" />
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
      this.$store.commit("explore/isPlaying", false);
      let res = await this.$axios.$get(`/api/spotify/topTrack/${item.id}`);
      let tracks = res.body.tracks;
      this.source = tracks[0].preview_url;
      this.$store.commit("explore/playerSource", tracks[0].preview_url);
      this.$store.commit("explore/isPlaying", true);
      console.log(this.$store);
    },
    stopPlayer() {
      this.$store.commit("explore/isPlaying", false);
    },
    updateSearchedArtist(item) {
      this.searchedArtists = [item];
    },
    addSelectedArtists(item) {
      this.$store.commit("explore/addSelectedArtist", item);
      console.log(this.selectedArtists);
    },
  },
  computed: {
    ...mapGetters({
      isPlaying: "explore/isPlaying",
      playerSource: "explore/playerSource",
    }),
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
  },
};
</script>

<style>
</style>