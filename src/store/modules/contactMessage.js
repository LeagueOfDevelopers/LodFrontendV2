import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  contactMessage: {},
  contactMessageStateStatus: statuses.available
};

const getters = {
  contactMessage: state => state.contactMessage,
  contactMessageStateStatus: state => state.contactMessageStateStatus
};

const mutations = {
  UPDATE_CONTACT_MESSAGE(state, contactMessage) {
    state.contactMessage = contactMessage;
  },
  UPDATE_CONTACT_MESSAGE_STATE_STATUS(state, status) {
    state.contactMessageStateStatus = status;
  }
};

const actions = {
  sendContactMessage({ commit }) {
    commit("UPDATE_CONTACT_MESSAGE_STATE_STATUS", statuses.loading);
    API().sendContactMessage(state.contactMessage)
      .then(() => {
        commit("UPDATE_CONTACT_MESSAGE_STATE_STATUS", statuses.succeeded);
      })
      .catch(() => {
        commit("UPDATE_CONTACT_MESSAGE_STATE_STATUS", statuses.failed);
      });
  },
  clearContactMessage({ commit }) {
    commit("UPDATE_CONTACT_MESSAGE", {});
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
