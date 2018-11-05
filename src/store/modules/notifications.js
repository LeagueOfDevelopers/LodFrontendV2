import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  notifications: [],
  notificationsStateStatus: statuses.available,
  notificationsAmount: 0,
  notificationsTotalAmount: 0,
  notificationsCurrentPage: 0,
  notificationsPageOpacity: 6,
  readNotificationsStateStatus: statuses.available
};

const getters = {
  notificationsAmount: state => state.notificationsAmount,
  notifications: state => state.notifications,
  notificationsStateStatus: state => state.notificationsStateStatus,
  readNotificationsStateStatus: state => state.readNotificationsStateStatus
};

const mutations = {
  UPDATE_NOTIFICATIONS_AMOUNT(state, amount) {
    state.notificationsAmount = amount;
  },
  ADD_NOTIFICATIONS(state, notifications) {
    state.notifications.concat(notifications);
  },
  UPDATE_NOTIFICATIONS_STATE_STATUS(state, status) {
    state.notificationsStateStatus = status;
  },
  UPDATE_NOTIFICATIONS_TOTAL_AMOUNT(state, amount) {
    state.notificationsTotalAmount = amount;
  },
  INCREASE_NOTIFICATIONS_CURRENT_PAGE_NUMBER(state) {
    state.notificationsCurrentPage++;
  },
  UPDATE_READ_NOTIFICATIONS_STATE_STATUS(state, status) {
    state.readNotificationsStateStatus = status;
  }
};

const actions = {
  loadNotifications({ commit }) {
    commit("UPDATE_NOTIFICATIONS_STATE_STATUS", "loading");
    API()
      .get(`event/${this.notificationsCurrentPage + 1}`)
      .then(response => {
        commit("ADD_NOTIFICATIONS", response.data.Data);
        commit(
          "UPDATE_NOTIFICATIONS_TOTAL_AMOUNT",
          response.data.CountOfEntities
        );
        if (
          (this.notificationsCurrentPage + 1) * this.notificationsPageOpacity <
          this.notificationsTotalAmount
        )
          commit("UPDATE_NOTIFICATIONS_STATE_STATUS", "available");
        else commit("UPDATE_NOTIFICATIONS_STATE_STATUS", "unavailable");
        commit("INCREASE_NOTIFICATIONS_CURRENT_PAGE_NUMBER");
      });
  },
  readNotifications({ commit }) {
    commit("UPDATE_READ_NOTIFICATIONS_STATE_STATUS", "loading");
    API()
      .put(
        `event/read`,
        this.notifications.filter(notification => !notification.WasRead)
      )
      .then(() => commit("UPDATE_READ_NOTIFICATIONS_STATE_STATUS", "available"))
      .catch(() => {
        commit("UPDATE_READ_NOTIFICATIONS_STATE_STATUS", "failed");
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
