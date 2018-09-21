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
  ADD_PROJECTS(state, projects) {
    state.projects = state.projects.concat(projects);
  },
  RESET_PROJECTS(state) {
    state.projects = [];
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
    if (state.projects.length !== 0) {
      commit("RESET_PROJECTS");
    }
    const componentsInRowNumber = getComponentsInRowNumber();
    const selectedCategories = rootGetters.selectedCategoryIndexes.join(",");
    API()
      .get(
        `/projects/${
          state.projects.length
        }/${componentsInRowNumber}?&categories=${selectedCategories}`
      )
      .then(response => {
        commit("ADD_PROJECTS", response.data.Data);
        // add check for available projects to load
        // response.data.CountOfEntities === state.projects.length
      });
  },
  LOAD_MORE_PROJECTS({ commit, rootGetters }) {
    const componentsInRowNumber = getComponentsInRowNumber();
    const selectedCategories = rootGetters.selectedCategoryIndexes.join(",");
    API()
      .get(
        `/projects/${
          state.projects.length
        }/${componentsInRowNumber}?&categories=${selectedCategories}`
      )
      .then(response => {
        commit("ADD_PROJECTS", response.data.Data);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
