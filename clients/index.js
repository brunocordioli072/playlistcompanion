const { createClient, generateQueryOp } = require("./graphql");
const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  graphqlClient: () => {
    const vuexLocal = localStorage.getItem("vuex");
    const vuex = JSON.parse(vuexLocal);
    return createClient({
      url: isDev ? process.env.BRIDGE_URL_DEV : process.env.BRIDGE_URL_PROD,
      headers: {
        Authorization:
          vuex && vuex.client && vuex.client.access_token
            ? vuex.client.access_token
            : ""
      }
    });
  }
};
