import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  currentUser: {
    id: 0,
    isAuthorized: false
  },
  credentials: {
    email: "",
    password: ""
  },
  authorizeUserStateStatus: "available"
};

const getters = {
  userId: state => state.currentUser.id,
  isAuthorized: state => state.currentUser.isAuthorized,
  credentials: state => state.credentials,
  authorizeUserStateStatus: state => state.authorizeUserStateStatus
};

const mutations = {
  UPDATE_USER_ID(state, userId) {
    state.currentUser.id = userId;
  },
  UPDATE_IS_USER_AUTHORIZED(state, isAuthorized) {
    state.currentUser.isAuthorized = isAuthorized;
  },
  UPDATE_IS_AUTHORIZE_USER_STATE_STATUS(state, status) {
    state.authorizeUserStateStatus = statuses[status];
  }
};

const actions = {
  UPDATE_USER_ID({ commit }, userId) {
    commit("UPDATE_USER_ID", userId);
  },
  AUTHORIZE_USER_WITH_CREDENTIALS({ dispatch, commit }, credentials) {
    commit("UPDATE_IS_AUTHORIZE_USER_STATE_STATUS", "loading");
    API()
      .post(`login`, credentials)
      .then(response => {
        dispatch("AUTHORIZE_USER", response.data.Token);
        commit("UPDATE_IS_AUTHORIZE_USER_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_IS_AUTHORIZE_USER_STATE_STATUS", "failed");
      });
  },
  AUTHORIZE_USER({ commit }, token) {
    commit("UPDATE_IS_USER_AUTHORIZED", true);
    localStorage.setItem("token", token);
  },
  UNAUTHORIZE_USER({ commit }) {
    commit("UPDATE_IS_USER_AUTHORIZED", false);
    localStorage.removeItem("token");
  },
  CHECK_AUTHORIZATION({ dispatch }) {
    if (!state.currentUser.isAuthorized) {
      const token = localStorage.getItem("token");
      if (token) dispatch("AUTHORIZE_USER", token);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
