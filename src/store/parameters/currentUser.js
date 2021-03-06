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
    localStorage.setItem("userId", userId);
  },
  AUTHORIZE_USER_WITH_CREDENTIALS({ dispatch, commit }, credentials) {
    commit("UPDATE_IS_AUTHORIZE_USER_STATE_STATUS", "loading");

    API().authorizeUser(credentials)
      .then(response => {
        dispatch("AUTHORIZE_USER", response.data.Token);
        dispatch("UPDATE_USER_ID", response.data.UserId);
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
    localStorage.removeItem("userId");
  },
  CHECK_AUTHORIZATION({ dispatch, commit }) {
    if (!state.currentUser.isAuthorized) {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch("AUTHORIZE_USER", token);
        const userId = localStorage.getItem("userId");
        if (userId) commit("UPDATE_USER_ID", userId);
      }
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
