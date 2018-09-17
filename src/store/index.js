import Vue from "vue";
import Vuex from "vuex";

// MODULES
import developers from "./modules/developers";
import projects from "./modules/projects";

// STATIC
import categories from "./static/categories";

// PARAMETERS
import currentUser from "./parameters/currentUser";
import notifications from "./parameters/notifications";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    // MODULES
    developers,
    projects,

    // STATIC
    currentUser,
    notifications,

    // PARAMETERS
    categories
  }
});
