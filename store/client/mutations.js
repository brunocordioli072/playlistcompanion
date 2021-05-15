export default {
  accessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  refreshToken(state, refreshToken) {
    state.refreshToken = refreshToken;
  },
  expiresIn(state, expiresIn) {
    state.expiresIn = expiresIn;
  },
};
