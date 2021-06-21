import Vue from "vue";
import Vuex from "vuex";

import account from "./account";
import general from "./general";
import oracles from "./oracles";

Vue.use(Vuex);

export default function() {
  const Store = new Vuex.Store({
    state: {
    },
    modules: {
      general,
      account,
      oracles
    },

    strict: process.env.DEV
  });

  return Store;
}
