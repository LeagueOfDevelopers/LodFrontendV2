import API from "../../api.js";
import { getComponentsInRowNumber } from "../../helpers.js";

const state = {
  randomProjects: [],
  projects: []
};

const getters = {
  randomProjects: state => state.randomProjects,
  projects: state => state.projects,
  projectsNumber: state => state.projects.length
};

const mutations = {
  UPDATE_RANDOM_PROJECTS(state, randomProjects) {
    state.randomProjects = randomProjects;
  },
  UPDATE_PROJECTS(state, projects) {
    state.projects = projects;
  }
};

const actions = {
  LOAD_RANDOM_PROJECTS({ commit }) {
    API()
      .get(`/projects/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_RANDOM_PROJECTS", response.data);
      });
  },
  LOAD_PROJECTS({ commit, rootGetters }) {
    const selectedCategories = rootGetters.selectedCategoryIndexes.join(",");
    const componentsInRowNumber = getComponentsInRowNumber();
    API()
      .get(
        `/projects/${
          state.projects.length
        }/${componentsInRowNumber}?&categories=${selectedCategories}`
      )
      .then(response => {
        commit("UPDATE_PROJECTS", response.data.Data);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
