export default {
  search(state) {
    return state.search;
  },
  artists(state) {
    return state.artists;
  },
  searchedArtists(state) {
    return state.searchedArtists;
  },
  selectedArtistsNames(state) {
    if (state.selectedArtists.length > 0) {
      return state.selectedArtists.map((a) => a.name);
    } else return [];
  },
  selectedArtists(state) {
    return state.selectedArtists;
  },
  relatedArtists(state) {
    return state.relatedArtists;
  },
  playerSource(state) {
    return state.playerSource;
  },
  playerIsLoading(state) {
    return state.playerIsLoading;
  },
  playerIsPlaying(state) {
    return state.playerIsPlaying;
  },
  modalVisible(state) {
    return state.modalVisible;
  },
  creatingPlaylist(state) {
    return state.creatingPlaylist;
  },
};
