export default {
  setAccess_token(state, accessToken) {
    state.access_token = accessToken;
  },
  setRefresh_token(state, refreshToken) {
    state.refresh_token = refreshToken;
  },
  setExpires_in(state, expiresIn) {
    state.expires_in = expiresIn;
  },
  isMobile(state, isMobile) {
    state.isMobile = isMobile;
  },
};
