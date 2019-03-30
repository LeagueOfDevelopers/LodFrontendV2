import Vue from "vue";
import Vuex from "vuex";

// MODULES
import developers from "./modules/developers";
import projects from "./modules/projects";
import newDeveloper from "./modules/newDeveloper";
import contactMessage from "./modules/contactMessage";
import notifications from "./modules/notifications";
import developerProfile from "./modules/developerProfile";
import developerChangePassword from "./modules/developerChangePassword";
import developerNotificationSettings from "./modules/developerNotificationSettings";
import portfolio from "./modules/portfolio";
import project from "./modules/project";

// STATIC
import categories from "./static/categories";

// PARAMETERS
import currentUser from "./parameters/currentUser";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    // MODULES
    developers,
    projects,
    newDeveloper,
    contactMessage,
    notifications,
    developerProfile,
    developerChangePassword,
    developerNotificationSettings,
    portfolio,
    project,

    // STATIC
    currentUser,

    // PARAMETERS
    categories
  }
});
