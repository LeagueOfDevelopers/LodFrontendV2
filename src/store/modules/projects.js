import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  randomProjects: [],
  projects: [],
  currentCategory: 0,
  projectsStateStatus: statuses.available,
  projectsOnPageCount: 10,
  allProjectsCount: 0
};

const getters = {

};

const mutations = {
  ADD_PROJECTS(state, projects) {
    state.projects = state.projects.concat(projects);
  },
  RESET_PROJECTS(state) {
    state.projects = [];
    state.allProjectsCount = 0;
    state.projectsStateStatus = statuses.available;
  },
  UPDATE_RANDOM_PROJECTS(state, randomProjects) {
    state.randomProjects = randomProjects;
  },
  UPDATE_PROJECTS_STATE_STATUS(state, status) {
    state.projectsStateStatus = statuses[status];
  },
  UPDATE_PROJECTS_CATEGORY(state, category) {
    state.currentCategory = category;
  },
  UPDATE_ALL_PROJECTS_COUNT(state, count) {
    state.allProjectsCount = count;
  }
};

const actions = {
  async LOAD_RANDOM_PROJECTS({ commit }) {
    try {
      const projects = await API.getRandomProjects();
      commit("UPDATE_RANDOM_PROJECTS", projects);
    }
    catch {
      commit("UPDATE_PROJECTS_STATE_STATUS", statuses.failed);
    }
  },

  async LOAD_PROJECTS({ commit }, count = state.projectsOnPageCount) {
    commit("UPDATE_PROJECTS_STATE_STATUS", "loading");

    try {
      const res = state.currentCategory ?
        await API.getProjects(count, state.projects.length, state.currentCategory) :
        await API.getProjects(count, state.projects.length);

      commit("ADD_PROJECTS", res.projects);
      commit("UPDATE_ALL_PROJECTS_COUNT", res.allProjectsCount);

      const projectsStateStatus = state.projects.length < state.allProjectsCount ?
        statuses.available : statuses.unavailable;

      commit("UPDATE_PROJECTS_STATE_STATUS", projectsStateStatus);
    }
    catch {
      commit("UPDATE_PROJECTS_STATE_STATUS", statuses.failed);
    }
  },

  LOAD_MORE_PROJECTS({ dispatch }) {
    if (state.projectsStateStatus === statuses.unavailable) return;

    const projectsLeft = state.allProjectsCount - state.projects.length;

    projectsLeft > state.projectsOnPageCount ?
      dispatch("LOAD_PROJECTS") :
      dispatch("LOAD_PROJECTS", projectsLeft);
  },
  FILTER_PROJECTS({commit, dispatch}, category) {
    commit("UPDATE_PROJECTS_CATEGORY", category)
    commit("RESET_PROJECTS");

    dispatch("LOAD_PROJECTS");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
