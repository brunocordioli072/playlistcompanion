export default {
  searchedArtists(state, searchedArtists) {
    state.searchedArtists = searchedArtists;
  },
  selectedArtists(state, selectedArtists) {
    state.selectedArtists = selectedArtists;
  },
  relatedArtists(state, relatedArtists) {
    state.relatedArtists = relatedArtists;
  },
  addSelectedArtist(state, selectedArtist) {
    state.selectedArtists.push(selectedArtist);
  },
  playerSource(state, playerSource) {
    state.playerSource = playerSource;
  },
  isPlaying(state, isPlaying) {
    state.isPlaying = isPlaying;
  }
};
