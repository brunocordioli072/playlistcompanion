<template>
  <div style="display: flex; justify-content: center; text-align: center">
    <a-space direction="vertical">
      <c-search-artist></c-search-artist>

      <div style="text-align: left !important; max-height: 400px">
        <c-searched-artists></c-searched-artists>
      </div>

      <div>
        <a-space
          v-if="relatedArtists.length > 0"
          direction="vertical"
          align="center"
        >
          <div style="margin: 10px">
            <span style="text-align: left">
              <a-icon type="arrow-down" />&nbsp;Artists related to
              <a
                target="_blank"
                :href="this.searchedArtists[0].external_urls.spotify"
                >{{ this.searchedArtists[0].name }}</a
              >
              <a-icon type="arrow-down" />
            </span>
          </div>
          <c-related-artists></c-related-artists>
        </a-space>
        <a-button
          v-show="selectedArtists.length > 0"
          type="primary"
          block
          @click="modalVisible = true"
          >Create Playlist</a-button
        >
      </div>
      <div v-show="selectedArtists.length > 0">
        <span style="text-align: left">
          <a-icon type="arrow-down" />&nbsp;Artists selected to the playlist
          <a-icon type="arrow-down" />
        </span>
        <a-timeline>
          <a-space align="center">
            <c-selected-artists></c-selected-artists>
          </a-space>
        </a-timeline>
      </div>
    </a-space>
    <vue-plyr ref="plyr" style="display: none; visibility: hidden">
      <audio>
        <source type="audio/mp3" />
      </audio>
    </vue-plyr>
    <c-create-playlist></c-create-playlist>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    plyr: {
      get() {
        return (this.$refs.plyr as Vue & { player: {
        stop: Function
        play: Function
        paused: boolean
        source: Object
        autoplay: boolean
        loop: boolean
      }}).player;
      },
    },
    playerIsPlaying: {
      get() {
        return this.$store.getters['explore/playerIsPlaying'];
      },
      set: function(val) {
        this.$store.commit('explore/playerIsPlaying', val);
      },
    },
    playerSource: {
      get() {
        return this.$store.getters['explore/playerSource'];
      },
      set: function(val) {
        this.$store.commit('explore/playerSource', val);
      },
    },
    searchedArtists: {
      get() {
        return this.$store.getters['explore/searchedArtists'];
      },
      set: function(val) {
        this.$store.commit('explore/searchedArtists', val);
      },
    },
    selectedArtists: {
      get: function() {
        return this.$store.getters['explore/selectedArtists'];
      },
      set: function(val) {
        this.$store.commit('explore/selectedArtists', val);
      },
    },
    relatedArtists: {
      get: function() {
        return this.$store.getters['explore/relatedArtists'];
      },
      set: function(val) {
        this.$store.commit('explore/relatedArtists', val);
      },
    },
    modalVisible: {
      get: function() {
        return this.$store.getters['explore/modalVisible'];
      },
      set: function(val) {
        this.$store.commit('explore/modalVisible', val);
      },
    },
  },
  watch: {
    playerIsPlaying() {
      if (!this.playerIsPlaying) {
        this.plyr.stop();
      }
      if (this.playerIsPlaying && this.plyr.paused == true) {
        this.plyr.play();
      }
    },
    playerSource() {
      this.plyr.source = {
        type: 'audio',
        sources: [{src: this.playerSource, type: 'audio/mp3'}],
      };
    },
    async searchedArtists() {
      await this.fetchRelatedArtists();
    },
  },
  methods: {
    async fetchRelatedArtists() {
      if (this.searchedArtists.length > 0) {
        const artistId = this.searchedArtists[0].id;
        try {
          const res = await this.$spotify.api.getArtistRelatedArtists(artistId);
          this.relatedArtists = res.body.artists;
        } catch (e) {}
      }
    },
    updateSearchedArtist(item: any) {
      this.searchedArtists = [item];
    },
  },
  async mounted() {
    this.plyr.autoplay = true;
    this.plyr.loop = true;
    const res = await this.$spotify.api.getArtist('43ZHCT0cAZBISjO8DG9PnE');
    this.updateSearchedArtist(res.body);
    this.fetchRelatedArtists();
  },
});
</script>

<style>
.tag {
  margin: 2px;
}
</style>
