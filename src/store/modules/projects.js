import API from "../../api";
import statuses from "../stateStatuses";
import {getComponentsInRowNumber} from "../../helpers";

const state = {
  randomProjects: [],
  projects: [],
  currentCategory: -1,
  projectsStateStatus: statuses.available
};

const getters = {
  randomProjects: state => state.randomProjects,
  projects: state => {
    return state.currentCategory === -1 ?
      state.projects :
      state.projects.filter(project => project.Category === state.currentCategory);
  },
  currentCategory: state => state.currentCategory,
  projectsNumber: state => state.projects.length,
  projectsStateStatus: state => state.projectsStateStatus
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
  },
  UPDATE_PROJECTS_STATE_STATUS(state, status) {
    state.projectsStateStatus = statuses[status];
  },
  UPDATE_PROJECTS_CATEGORY(state, category) {
    state.currentCategory = category;
  }
};

const actions = {
  LOAD_RANDOM_PROJECTS({commit}) {
    API.requestRandomProjects()
      .then(response => {
        commit("UPDATE_RANDOM_PROJECTS", response);
      })
  },
  LOAD_PROJECTS({commit, rootGetters}) {
    if (state.projects.length !== 0) commit("RESET_PROJECTS");
    commit("UPDATE_PROJECTS_STATE_STATUS", "loading");

    const selectedCategories = rootGetters.selectedCategoryIndexes.join(",");

    API.requestProjects(state.projects.length, selectedCategories)
      .then(response => {
        commit("ADD_PROJECTS", response);
        if (state.projects.length !== response.data.CountOfEntities) {
          commit("UPDATE_PROJECTS_STATE_STATUS", "available");
        } else {
          commit("UPDATE_PROJECTS_STATE_STATUS", "unavailable");
        }
      })
      .catch(() => {
        commit("UPDATE_PROJECTS_STATE_STATUS", "failed");
      });
  },
  LOAD_MORE_PROJECTS({commit, rootGetters}) {
    if (state.projectsStateStatus === "available") {
      commit("UPDATE_PROJECTS_STATE_STATUS", "loading");

      const componentsInRowNumber = getComponentsInRowNumber();
      const selectedCategories = rootGetters.selectedCategoryIndexes.join(",");

      API().requestProjects(state.projects.length, selectedCategories)
        .then(response => {
          commit("ADD_PROJECTS", response.data.Data);
          if (state.projects.length !== response.data.CountOfEntities) {
            commit("UPDATE_PROJECTS_STATE_STATUS", "available");
          } else {
            commit("UPDATE_PROJECTS_STATE_STATUS", "unavailable");
          }
        })
        .catch(() => {
          commit("UPDATE_PROJECTS_STATE_STATUS", "failed");
        });
    }
  },
  FILTER_PROJECTS({commit}, category) {
    commit("UPDATE_PROJECTS_CATEGORY", category);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
