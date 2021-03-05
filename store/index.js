import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({ client: state.client })
});

export const plugins = [vuexLocal.plugin];
