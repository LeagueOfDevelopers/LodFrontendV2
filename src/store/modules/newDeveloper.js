import API from "../../api.js";
import statuses from "../stateStatuses";

const state = {
  newDeveloper: {},
  newDeveloperStateStatus: "available"
};

const getters = {
  newDeveloper: state => state.newDeveloper,
  newDeveloperStateStatus: state => state.newDeveloperStateStatus
};

const mutations = {
  UPDATE_NEW_DEVELOPER(state, newDeveloper) {
    state.newDeveloper = newDeveloper;
  },
  UPDATE_NEW_DEVELOPER_STATE_STATUS(state, status) {
    state.newDeveloperStateStatus = statuses[status];
  }
};

const actions = {
  POST_NEW_DEVELOPER({ commit }, newDeveloper) {
    commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "loading");
    API()
      .post(`developers`, newDeveloper)
      .then(response => {
        commit("UPDATE_NEW_DEVELOPER", response.data.Data);
        commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "failed");
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
