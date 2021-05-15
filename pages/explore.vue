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

<script>
import {mapGetters} from 'vuex';
import {spotify} from '../clients/spotify';

const spotifyAPI = spotify.client();

export default {
  computed: {
    ...mapGetters({
      playerIsPlaying: 'explore/playerIsPlaying',
      playerSource: 'explore/playerSource',
    }),
    searchedArtists: {
      get: function() {
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
        this.$refs.plyr.player.stop();
      }
      if (this.playerIsPlaying && this.$refs.plyr.player.paused == true) {
        this.$refs.plyr.player.play();
      }
    },
    playerSource() {
      this.$refs.plyr.player.source = {
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
          const res = await spotifyAPI.getArtistRelatedArtists(artistId);
          this.relatedArtists = res.body.artists;
        } catch (e) {
          this.$notification.open({
            message: 'Error on fetching related artists',
            description: `Some error has occured, please try again or refresh the page...`,
            icon: <a-icon type="monitor" style="color: red" />,
          });
        }
      }
    },
    updateSearchedArtist(item) {
      this.searchedArtists = [item];
    },
  },
  async mounted() {
    this.$refs.plyr.player.autoplay = true;
    this.$refs.plyr.player.loop = true;
    const res = await spotifyAPI.getArtist('43ZHCT0cAZBISjO8DG9PnE');
    this.updateSearchedArtist(res.body);
    this.fetchRelatedArtists();
    const getSpotifyUser = async () => {
      try {
        const res = await spotifyAPI.getMe();
        this.$ga.set({userId: res.body.id});
      } catch (e) {
        this.$notification.open({
          message: 'Error on getting user profile',
          description: `Some error has occured, please try again or refresh the page...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    };
    setTimeout(getSpotifyUser, 2000);
  },
};
</script>

<style>
.tag {
  margin: 2px;
}
</style>
