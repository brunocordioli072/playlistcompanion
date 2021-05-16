<template>
  <a-modal
    title="The Playlist Maker"
    :visible="modalVisible"
    okText="Create"
    :confirm-loading="creatingPlaylist"
    @ok="createPlaylist"
    @cancel="modalVisible = false"
  >
    <a-input v-model="playlistName" placeholder="Name of your playlist" />
    <p style="text-align: justify">
      This playlist will be added to
      <b>your spotify account</b> with the <b>10</b> top tracks of
      <b>each artist</b> you selected!
    </p>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      playlistName: null,
    };
  },
  computed: {
    selectedArtists: {
      get: function() {
        return this.$store.getters['explore/selectedArtists'];
      },
      set: function(val) {
        this.$store.commit('explore/selectedArtists', val);
      },
    },
    creatingPlaylist: {
      get: function() {
        return this.$store.getters['explore/creatingPlaylist'];
      },
      set: function(val) {
        this.$store.commit('explore/creatingPlaylist', val);
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
  methods: {
    clearView() {
      this.$store.commit('explore/creatingPlaylist', false);
      this.$store.commit('explore/modalVisible', false);
      this.$store.commit('explore/playlistName', null);
      this.$store.commit('explore/search', []);
      this.$store.commit('explore/artists', []);
      this.$store.commit('explore/searchedArtists', []);
      this.$store.commit('explore/selectedArtists', []);
      this.$store.commit('explore/relatedArtists', []);
    },
    async createPlaylist() {
      this.creatingPlaylist = true;
      try {
        const res = await this.$spotify.api.createPlaylist(this.playlistName, {
          public: false,
        });
        const playlist = res.body;
        try {
          const tracks = [];
          const artistIds = this.selectedArtists.map((a) => a.id);
          for (let index = 0; index < artistIds.length; index++) {
            const artistId = artistIds[index];
            const trackSearch = await this.$spotify.api.getArtistTopTracks(
                artistId,
                'GB',
            );
            tracks.push(...trackSearch.body.tracks);
          }
          const tracksURIs = tracks.map((t) => t.uri);
          await this.$spotify.api.addTracksToPlaylist(playlist.id, tracksURIs);
        } catch (e) {
          this.$notification.open({
            message: 'Error on saving musics',
            description: `Some error has occured, please try again...`,
            icon: <a-icon type="monitor" style="color: red" />,
          });
        }
        this.$notification.open({
          message: 'Playlist created!!!',
          description: `Playlist added to your spotify with the name ${this.playlistName}`,
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
        this.$ga.event({
          eventCategory: 'Button',
          eventAction: 'Click',
          eventLabel: 'Playlist Created',
        });
        this.clearView();
      } catch (e) {
        this.$notification.open({
          message: 'Error on creating playlist',
          description: `Some error has occured, please try again...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    },
  },
};
</script>

<style></style>
