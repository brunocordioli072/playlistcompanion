export default {
  setAccess_token(state, access_token) {
    state.access_token = access_token;
  },
  setRefresh_token(state, refresh_token) {
    state.refresh_token = refresh_token;
  },
  setExpires_in(state, expires_in) {
    state.expires_in = expires_in;
  }
};
