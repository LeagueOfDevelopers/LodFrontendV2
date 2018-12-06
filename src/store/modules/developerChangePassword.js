import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  developerChangePassword: "",
  developerChangePasswordStateStatus: statuses.available
};

const getters = {
  changePassword: state => state.developerChangePassword,
  changePasswordStateStatus: state => state.developerChangePasswordStateStatus
};

const mutations = {
  UPDATE_DEVELOPER_CHANGE_PASSWORD_STATE_STATUS(state, status) {
    state.developerChangePasswordStateStatus = status;
  }
};

const actions = {
  changePassword({ commit }) {
    commit("UPDATE_CHANGE_PASSWORD_STATE_STATUS", "loading");
    const request = {
      NewPassword: this.changePassword,
      Token: localStorage.getItem("token")
    };
    API().putNewPassword(request)
      .then(() => {
        commit("UPDATE_CHANGE_PASSWORD_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_CHANGE_PASSWORD_STATE_STATUS", "failed");
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
