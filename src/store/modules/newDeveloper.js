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
  POST_NEW_DEVELOPER({ commit }, newDeveloper, withCredentials) {
    commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "loading");
    if (withCredentials)
      API()
        .post(`developers`, newDeveloper)
        .then(response => {
          commit("UPDATE_NEW_DEVELOPER", response.data);
          commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "succeeded");
        })
        .catch(() => {
          commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "failed");
        });
    else
      API()
        .post(
          `signup/github?frontend_callback=localhost:8080/signup`,
          newDeveloper
        )
        .then(response => {
          window.location.href = response.data;
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
