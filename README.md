# playlistcompanion
> PlaylistCompanion

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/997e609005a448d0bfbc604b9c2e590e)](https://app.codacy.com/gh/brunocordioli072/playlistcompanion?utm_source=github.com&utm_medium=referral&utm_content=brunocordioli072/playlistcompanion&utm_campaign=Badge_Grade_Settings)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

[PlaylistCompanion](https://brunocordioli072.github.io/playlistcompanion) is your best friend when the subject is music. It helps you see all your favorite musicians and see all the musicians that are related to them! 

## How it works

[PlaylistCompanion](https://brunocordioli072.github.io/playlistcompanion) uses in general two services. One is the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/) used to perform actions in spotify and get the musics/playlists and the other is [companion-worker](https://github.com/brunocordioli072/companion-worker) which is used to provide the app authorization from Spotify.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
