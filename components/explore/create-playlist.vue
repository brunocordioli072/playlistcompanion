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
import { graphqlClient } from "../../clients";

export default {
  data() {
    return {
      playlistName: null,
    };
  },
  computed: {
    selectedArtists: {
      get: function () {
        return this.$store.getters["explore/selectedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/selectedArtists", val);
      },
    },
    creatingPlaylist: {
      get: function () {
        return this.$store.getters["explore/creatingPlaylist"];
      },
      set: function (val) {
        this.$store.commit("explore/creatingPlaylist", val);
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
  methods: {
    clearView() {
      this.$store.commit("explore/creatingPlaylist", false);
      this.$store.commit("explore/modalVisible", false);
      this.$store.commit("explore/playlistName", null);
      this.$store.commit("explore/search", []);
      this.$store.commit("explore/artists", []);
      this.$store.commit("explore/searchedArtists", []);
      this.$store.commit("explore/selectedArtists", []);
      this.$store.commit("explore/relatedArtists", []);
    },
    async createPlaylist() {
      this.creatingPlaylist = true;
      try {
        let res = await graphqlClient().mutation({
          insertPlaylist: [{ playlistName: this.playlistName }, { id: true }],
        });
        let playlist = res.insertPlaylist;
        try {
          await graphqlClient().mutation({
            insertArtistsToPlaylist: [
              {
                artistIds: this.selectedArtists.map((a) => a.id),
                playlistId: playlist.id,
              },
            ],
          });
        } catch (e) {
          this.$notification.open({
            message: "Error on saving musics",
            description: `Some error has occured, please try again...`,
            icon: <a-icon type="monitor" style="color: red" />,
          });
        }
        this.$notification.open({
          message: "Playlist created!!!",
          description: `Playlist added to your spotify with the name ${this.playlistName}`,
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
        this.$ga.event({
          eventCategory: "Button",
          eventAction: "Click",
          eventLabel: "Playlist Created",
        });
        this.clearView();
      } catch (e) {
        this.$notification.open({
          message: "Error on creating playlist",
          description: `Some error has occured, please try again...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    },
  },
};
</script>

<style>
</style>