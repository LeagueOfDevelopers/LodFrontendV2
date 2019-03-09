import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  info: {},
  projectStateStatus: statuses.available
};

const getters = {
  availableStatus: state => state.projectStateStatus === statuses.available,
  failedStatus: state => state.projectStateStatus === statuses.failed
};

const mutations = {
  UPDATE_PROJECT_INFO(state, info) {
    state.info = info;
  },

  RESET_PROJECT_INFO(state) {
    state.info = {};
  },

  UPDATE_PROJECT_STATUS(state, status) {
    state.projectStateStatus = status;
  }
};

const actions = {
  async LOAD_PROJECT_INFO({commit}, id) {
    try {
      commit("UPDATE_PROJECT_STATUS", statuses.loading);
      commit("RESET_PROJECT_INFO");

      const info = await API.getProjectInfo(id);

      console.log(info);

      commit("UPDATE_PROJECT_INFO", info);
      commit("UPDATE_PROJECT_STATUS", statuses.available);
    }
    catch {
      commit("UPDATE_PROJECT_STATUS", statuses.failed);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}