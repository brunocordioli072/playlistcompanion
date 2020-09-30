const { createClient } = require("./graphql");
const vuexLocal = localStorage.getItem("vuex");
const vuex = JSON.parse(vuexLocal);
let isDev = process.env.NODE_ENV !== "prod";
module.exports = {
  createGraphQLClient: () => {
    return createClient({
      url: isDev
        ? "http://localhost:4000/prod/graphql"
        : "https://playlistcompanion.herokuapp.com",
      headers: {
        authorization: vuex.client.access_token,
      },
    });
  },
};