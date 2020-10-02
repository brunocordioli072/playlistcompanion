<template>
  <div>
    <a-space direction="vertical">
      <c-search-artist></c-search-artist>

      <div style="text-align: left !important; max-height: 400px">
        <c-searched-artists></c-searched-artists>
      </div>

      <div :style="!isMobile ? 'width: 81vw' : 'width: 95vw'">
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

<script>
import { everything } from "genql-runtime";
import { mapGetters } from "vuex";
import { createGraphQLClient } from "../clients";
const client = createGraphQLClient();

export default {
  computed: {
    ...mapGetters({
      playerIsPlaying: "explore/playerIsPlaying",
      playerSource: "explore/playerSource",
      isMobile: "client/isMobile",
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
    relatedArtists: {
      get: function () {
        return this.$store.getters["explore/relatedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/relatedArtists", val);
      },
    },
    modalVisible: {
      get: function () {
        return this.$store.getters["explore/modalVisible"];
      },
      set: function (val) {
        this.$store.commit("explore/modalVisible", val);
      },
    },
  },
  watch: {
    playerIsPlaying() {
      if (!this.playerIsPlaying) {
        this.$refs.plyr.player.stop();
      }
      if (this.playerIsPlaying && this.$refs.plyr.player.paused == true) {
        this.$refs.plyr.player.play();
      }
    },
    playerSource() {
      this.$refs.plyr.player.source = {
        type: "audio",
        sources: [{ src: this.playerSource, type: "audio/mp3" }],
      };
    },
    async searchedArtists() {
      await this.fetchRelatedArtists();
    },
  },
  methods: {
    async fetchRelatedArtists() {
      if (this.searchedArtists.length > 0) {
        let artistId = this.searchedArtists[0].id;
        try {
          let { artistsRelatedByArtistId } = await client.query({
            artistsRelatedByArtistId: [
              { artistId },
              {
                id: true,
                name: true,
                genres: true,
                popularity: true,
                images: { url: true },
                followers: { total: true },
                external_urls: { spotify: true },
              },
            ],
          });
          this.relatedArtists = artistsRelatedByArtistId;
        } catch (e) {
          this.$notification.open({
            message: "Error on fetching related artists",
            description: `Some error has occured, please try again or refresh the page...`,
            icon: <a-icon type="monitor" style="color: red" />,
          });
        }
      }
    },
  },
  middleware: "authentication",
  async mounted() {
    this.$refs.plyr.player.autoplay = true;
    this.$refs.plyr.player.loop = true;
    try {
      let res = await client.query({
        spotifyUser: {
          id: true,
        },
      });
      this.$ga.set({ userId: res.spotifyUser.id });
    } catch (e) {
      this.$notification.open({
        message: "Error",
        description: `Some error has occured, please try again or refresh the page...`,
        icon: <a-icon type="monitor" style="color: red" />,
      });
    }
  },
};
</script>

<style>
.tag {
  margin: 2px;
}
</style>