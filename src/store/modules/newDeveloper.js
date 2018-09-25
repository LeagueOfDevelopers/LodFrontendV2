import API from "../../api";
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
  POST_NEW_DEVELOPER({ commit }, data) {
    commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "loading");
    if (data.withCredentials) {
      API()
        .post(`developers`, data.newDeveloper)
        .then(response => {
          commit("UPDATE_NEW_DEVELOPER", response.data);
          commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "succeeded");
        })
        .catch(() => {
          commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "failed");
        });
    } else {
      API()
        .post(
          `signup/github?frontend_callback=localhost:8080/signup`,
          data.newDeveloper
        )
        .then(response => {
          window.location.href = response.data;
        })
        .catch(() => {
          commit("UPDATE_NEW_DEVELOPER_STATE_STATUS", "failed");
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
