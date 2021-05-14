import SpotifyWebApi from 'spotify-web-api-node';

const vuexLocal = localStorage.getItem('vuex');
const vuex = JSON.parse(vuexLocal);

export const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  accessToken:
    vuex && vuex.client && vuex.client.access_token ?
      vuex.client.access_token :
      '',
});
