<template>
  <a-space direction="horizontal">
    <a-icon
      v-show="search"
      :type="'search'"
      :style="{ fontSize: '20px', color: '#1890ff' }"
      @click="updateSearchedArtist(item)"
    />
    <a-divider type="vertical" />
    <a-icon
      :type="!hasArtistOnPlaylist ? 'plus-circle' : 'minus-circle'"
      :style="
        !hasArtistOnPlaylist
          ? { fontSize: '20px', color: '#1890ff' }
          : { fontSize: '20px', color: 'red' }
      "
      @click="
        !hasArtistOnPlaylist
          ? addSelectedArtists(item)
          : removeSelectedArtists(item)
      "
    />
    <a-divider type="vertical" />
    <a-icon
      :type="'play-circle'"
      :style="
        !canBePlayed
          ? { fontSize: '20px', color: 'grey' }
          : { fontSize: '20px', color: 'green' }
      "
      @click="!canBePlayed ? playTopTrackByArtist(item) : stopPlayer()"
    />
    <!-- <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <a-icon type="down" />
    </a>-->
  </a-space>
</template>

<script>
import {mapGetters} from 'vuex';
import {spotify} from '../../clients/spotify';

const spotifyAPI = spotify.client();

export default {
  props: {
    item: Object,
    search: Boolean,
  },
  data() {
    return {
      source: '',
      sourceArtists: [],
    };
  },
  methods: {
    async playTopTrackByArtist(item) {
      this.playerIsPlaying = false;
      try {
        const res = await spotifyAPI.getArtistTopTracks(item.id, 'GB');
        const tracks = res.body.tracks;
        this.sourceArtists = tracks[0].artists.map((a) => a.name);
        this.source = tracks[0].preview_url;
        this.$store.commit('explore/playerSource', tracks[0].preview_url);
        this.playerIsPlaying = true;
      } catch (e) {
        this.$notification.open({
          message: 'Error fetching artists tracks',
          description: `Some error has occured, please try again or refresh the page...`,
          icon: <a-icon type="monitor" style="color: red" />,
        });
      }
    },
    removeSelectedArtists(item) {
      this.selectedArtists = this.selectedArtists.filter((a) => a != item);
    },
    stopPlayer() {
      this.sourceArtists = [];
      this.$store.commit('explore/playerIsPlaying', false);
    },
    updateSearchedArtist(item) {
      this.searchedArtists = [item];
    },
    addSelectedArtists(item) {
      this.$store.commit('explore/addSelectedArtist', item);
    },
  },
  computed: {
    ...mapGetters({
      selectedArtistsNames: 'explore/selectedArtistsNames',
      playerIsPlaying: 'explore/playerIsPlaying',
      playerIsLoading: 'explore/playerIsLoading',
      playerSource: 'explore/playerSource',
    }),
    canBePlayed() {
      return (
        this.sourceArtists.includes(this.item.name) &&
        this.playerIsPlaying &&
        this.source == this.playerSource
      );
    },
    hasArtistOnPlaylist() {
      return this.selectedArtistsNames.includes(this.item.name);
    },
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
    playerIsPlaying: {
      get: function() {
        return this.$store.getters['explore/playerIsPlaying'];
      },
      set: function(val) {
        this.$store.commit('explore/playerIsPlaying', val);
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
