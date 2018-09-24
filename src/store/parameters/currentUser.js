const state = {
  currentUser: {
    id: 1,
    isAuthorized: false
  }
};

const getters = {
  userId: state => state.currentUser.id,
  isAuthorized: state => state.currentUser.isAuthorized
};

const mutations = {
  UPDATE_USER_ID(state, userId) {
    state.currentUser.id = userId;
  },
  UPDATE_IS_USER_AUTHORIZED(state, isAuthorized) {
    state.currentUser.isAuthorized = isAuthorized;
  }
};

const actions = {
  UPDATE_USER_ID({ commit }, userId) {
    commit("UPDATE_USER_ID", userId);
  },
  AUTHORIZE_USER({ commit }, token) {
    commit("UPDATE_IS_USER_AUTHORIZED", true);
    localStorage.setItem("token", token);
  },
  UNAUTHORIZE_USER({ commit }) {
    commit("UPDATE_IS_USER_AUTHORIZED", false);
    localStorage.removeItem("token");
  },
  CHECK_TOKEN_VALIDITY() {
    // HERE REQUEST TO CHECK IF TOKEN VALID AND REFRESH
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
