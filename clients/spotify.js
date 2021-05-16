import SpotifyWebApi from 'spotify-web-api-node';

const access_token = localStorage.getItem('access_token');
export const spotify = {
  client: () => {
    return new SpotifyWebApi({
      accessToken: access_token,
    });
  },
};
