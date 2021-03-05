const {createClient} = require('./graphql');
module.exports = {
  graphqlClient: () => {
    const vuexLocal = localStorage.getItem('vuex');
    const vuex = JSON.parse(vuexLocal);
    return createClient({
      url: process.env.BRIDGE_URL,
      headers: {
        Authorization:
          vuex && vuex.client && vuex.client.access_token ?
            vuex.client.access_token :
            '',
      },
    });
  },
};
