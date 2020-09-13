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
    if (state.selectedArtists.length > 0)
      return state.selectedArtists.map(a => a.name);
    else return [];
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
  isPlaying(state) {
    return state.isPlaying;
  }
};
