export default {
  search(state, search) {
    state.search = search;
  },
  artists(state, artists) {
    state.artists = artists;
  },
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
  playerIsLoading(state, playerIsLoading) {
    state.playerIsLoading = playerIsLoading;
  },
  playerIsPlaying(state, playerIsPlaying) {
    state.playerIsPlaying = playerIsPlaying;
  },
};
