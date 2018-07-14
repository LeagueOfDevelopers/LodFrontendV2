import Vue from "vue";
import Vuex from "vuex";

import { home } from "./modules/home.js";
import { developers } from "./modules/developers.js";
import { projects } from "./modules/projects.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    developers,
    projects
  }
});
