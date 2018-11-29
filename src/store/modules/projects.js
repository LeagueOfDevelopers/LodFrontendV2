import API from "../../api.js";
import { getComponentsInRowNumber } from "../../helpers.js";
import statuses from "../stateStatuses";

import {fakeProjects} from "../../caps/caps";

const state = {
  randomProjects: [],
  projects: [],
  projectsStateStatus: statuses.available
};

const getters = {
  randomProjects: state => state.randomProjects,
  projects: state => state.projects,
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
  }
};

const actions = {
  LOAD_RANDOM_PROJECTS({ commit }) {
    API()
      .get(`/projects/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_RANDOM_PROJECTS", response.data);
      })
      .catch(() => {
        commit("UPDATE_RANDOM_PROJECTS", fakeProjects);
      });
  },
  LOAD_PROJECTS({ commit, rootGetters }) {
    if (state.projects.length !== 0) commit("RESET_PROJECTS");
    commit("UPDATE_PROJECTS_STATE_STATUS", "loading");
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
  LOAD_MORE_PROJECTS({ commit, rootGetters }) {
    if (state.projectsStateStatus === "available") {
      commit("UPDATE_PROJECTS_STATE_STATUS", "loading");
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
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
