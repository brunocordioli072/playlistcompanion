import SpotifyWebApi from 'spotify-web-api-node';

const vuexLocal = localStorage.getItem('vuex');
const vuex = JSON.parse(vuexLocal);

export const spotify = {
  client: () => {
    return new SpotifyWebApi({
      accessToken:
        vuex && vuex.client && vuex.client.access_token ?
          vuex.client.access_token :
          '',
    });
  },
};
