import moment from "moment";

export default {
  access_token(state) {
    return state.access_token;
  },
  refresh_token(state) {
    return state.refresh_token;
  },
  expires_in(state) {
    return state.expires_in;
  },
  isAuthenticated(state) {
    return state.expires_in && state.expires_in >= +moment();
  }
};
