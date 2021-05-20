<template>
  <div>
    <a-row type="flex" justify="center">
      <c-search-artist></c-search-artist>
    </a-row>
    <a-row type="flex" justify="center">
      <c-searched-artists></c-searched-artists>
    </a-row>

    <a-row type="flex" justify="center" v-if="searchedArtists.length > 0">
      <span style="text-align: left">
        <a-icon type="arrow-down" />&nbsp;Artists related to
        <a
          target="_blank"
          :href="this.searchedArtists[0].external_urls.spotify"
          >{{ this.searchedArtists[0].name }}</a
        >
        <a-icon type="arrow-down" />
      </span>
    </a-row>
    <a-row :style="{ padding: '30px' }">
      <c-related-artists></c-related-artists>
    </a-row>
    <a-row
      :style="{ padding: '30px' }"
      type="flex"
      justify="center"
      v-if="searchedArtists.length > 0"
    >
      <a-button
        v-show="selectedArtists.length > 0"
        type="primary"
        block
        @click="modalVisible = true"
        >Create Playlist</a-button
      >
    </a-row>
    <div v-show="selectedArtists.length > 0">
      <a-row type="flex" justify="center">
        <span style="text-align: left">
          <a-icon type="arrow-down" />&nbsp;Artists selected to the playlist
          <a-icon type="arrow-down" />
        </span>
      </a-row>
      <a-row type="flex" justify="center" :style="{ padding: '30px' }">
        <a-timeline>
          <c-selected-artists></c-selected-artists>
        </a-timeline>
      </a-row>
    </div>
    <vue-plyr ref="plyr" style="display: none; visibility: hidden">
      <audio>
        <source type="audio/mp3" />
      </audio>
    </vue-plyr>
    <c-create-playlist></c-create-playlist>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    plyr: {
      get() {
        return (this.$refs.plyr as Vue & {
          player: {
            stop: Function;
            play: Function;
            paused: boolean;
            source: Object;
            autoplay: boolean;
            loop: boolean;
          };
        }).player;
      }
    },
    playerIsPlaying: {
      get() {
        return this.$store.getters["explore/playerIsPlaying"];
      },
      set: function(val) {
        this.$store.commit("explore/playerIsPlaying", val);
      }
    },
    playerSource: {
      get() {
        return this.$store.getters["explore/playerSource"];
      },
      set: function(val) {
        this.$store.commit("explore/playerSource", val);
      }
    },
    searchedArtists: {
      get() {
        return this.$store.getters["explore/searchedArtists"];
      },
      set: function(val) {
        this.$store.commit("explore/searchedArtists", val);
      }
    },
    selectedArtists: {
      get: function() {
        return this.$store.getters["explore/selectedArtists"];
      },
      set: function(val) {
        this.$store.commit("explore/selectedArtists", val);
      }
    },
    relatedArtists: {
      get: function() {
        return this.$store.getters["explore/relatedArtists"];
      },
      set: function(val) {
        this.$store.commit("explore/relatedArtists", val);
      }
    },
    modalVisible: {
      get: function() {
        return this.$store.getters["explore/modalVisible"];
      },
      set: function(val) {
        this.$store.commit("explore/modalVisible", val);
      }
    }
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
        type: "audio",
        sources: [{ src: this.playerSource, type: "audio/mp3" }]
      };
    },
    async searchedArtists() {
      await this.fetchRelatedArtists();
    }
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
    }
  },
  async mounted() {
    this.plyr.autoplay = true;
    this.plyr.loop = true;
    const res = await this.$spotify.api.getArtist("43ZHCT0cAZBISjO8DG9PnE");
    this.updateSearchedArtist(res.body);
    this.fetchRelatedArtists();
  }
});
</script>

<style>
.tag {
  margin: 2px;
}
</style>
