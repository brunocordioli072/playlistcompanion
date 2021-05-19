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

<script lang="ts">
import Vue, {PropOptions} from 'vue';

export default Vue.extend({

  props: {
    item: Object as PropOptions<any>,
    search: Boolean as PropOptions<any>,
  },
  data() {
    return {
      source: '',
      sourceArtists: [''],
    };
  },
  computed: {
    selectedArtistsNames: {
      get(): any {
        return this.$store.getters['explore/selectedArtistsNames'];
      },
      set(val: any): void {
        this.$store.commit('explore/selectedArtistsNames', val);
      },
    },
    playerIsPlaying: {
      get(): any {
        return this.$store.getters['explore/playerIsPlaying'];
      },
      set(val: any): void {
        this.$store.commit('explore/playerIsPlaying', val);
      },
    },
    playerIsLoading: {
      get(): any {
        return this.$store.getters['explore/playerIsLoading'];
      },
      set(val: any): void {
        this.$store.commit('explore/playerIsLoading', val);
      },
    },
    playerSource: {
      get(): any {
        return this.$store.getters['explore/playerSource'];
      },
      set(val: any): void {
        this.$store.commit('explore/playerSource', val);
      },
    },
    searchedArtists: {
      get(): any {
        return this.$store.getters['explore/searchedArtists'];
      },
      set(val: any): void {
        this.$store.commit('explore/searchedArtists', val);
      },
    },
    selectedArtists: {
      get(): any {
        return this.$store.getters['explore/selectedArtists'];
      },
      set(val: any): void {
        this.$store.commit('explore/selectedArtists', val);
      },
    },
    canBePlayed(): boolean {
      return (
        this.sourceArtists.includes(this.item.name) &&
        this.playerIsPlaying &&
        this.source == this.playerSource
      );
    },
    hasArtistOnPlaylist(): boolean {
      return this.selectedArtistsNames.includes(this.item.name);
    },
  },
  watch: {
    playerIsLoading() {
      console.log(this.playerIsLoading);
    },
  },
  methods: {
    async playTopTrackByArtist(item: any) {
      this.playerIsPlaying = false;
      try {
        const res = await this.$spotify.api.getArtistTopTracks(item.id, 'GB');
        const tracks = res.body.tracks;
        this.sourceArtists = tracks[0].artists.map((a) => a.name);
        this.source = tracks[0].preview_url || '';
        this.$store.commit('explore/playerSource', tracks[0].preview_url);
        this.playerIsPlaying = true;
      } catch (e) {
        this.$notification['info']({
          message: 'Error fetching artists tracks',
          description: `Some error has occured, please try again or refresh the page...`,
        });
      }
    },
    removeSelectedArtists(item: any) {
      this.selectedArtists = this.selectedArtists.filter((a: any) => a != item);
    },
    stopPlayer() {
      this.sourceArtists = [];
      this.$store.commit('explore/playerIsPlaying', false);
    },
    updateSearchedArtist(item: any) {
      this.searchedArtists = [item];
    },
    addSelectedArtists(item: any) {
      this.$store.commit('explore/addSelectedArtist', item);
    },
  },
});
</script>

<style>
</style>
