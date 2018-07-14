import API from "../../api.js";
import { getComponentsInRowNumber } from "../../helpers.js";

const state = {
  projects: []
};

const getters = {
  projects: state => state.projects
};

const mutations = {
  UPDATE_PROJECTS(state, projects) {
    state.projects = projects;
  }
};

const actions = {
  LOAD_PROJECTS({ commit }) {
    API()
      .get(`/projects/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_PROJECTS", response.data);
      });
    /* .catch(error => console.log(error)); */
  }
};

export const projects = {
  state,
  getters,
  mutations,
  actions
};
