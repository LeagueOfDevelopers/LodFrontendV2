import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  developerInfo: {},
  developerProfileStateStatus: statuses.unavailable
};

const getters = {
  profile: state => state.developerProfile,
  profileStateStatus: state => state.developerProfileStateStatus
};

const mutations = {
  SET_DEVELOPER_INFO(state, data) {
    state.developerInfo = data;
  },
  RESET_DEVELOPER_INFO(state) {
    state.developerInfo = {};
  },
  UPDATE_DEVELOPER_PROFILE_STATE_STATUS(state, status) {
    state.developerProfileStateStatus = status;
  }
};

const actions = {
  async loadProfileData({ commit }, id) {
    try {
      commit("RESET_DEVELOPER_INFO");
      commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", statuses.loading);

      const data = await API.getDeveloperProfile(id);

      commit("SET_DEVELOPER_INFO", data);
      commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", statuses.available);
    }
    catch (err) {
      commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", statuses.failed);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
