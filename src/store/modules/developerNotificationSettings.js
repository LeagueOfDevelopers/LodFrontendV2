import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  developerNotificationSettings: [],
  developerNotificationSettingsStateStatus: statuses.available
};

const getters = {
  notificationSettings: state => state.developerNotificationSettings,
  notificationSettingsStateStatus: state =>
    state.developerNotificationSettingsStateStatus
};

const mutations = {
  UPDATE_DEVELOPER_NOTIFICATION_SETTINGS(state, notificationSettings) {
    state.developerNotificationSettings = notificationSettings;
  },
  UPDATE_DEVELOPER_NOTIFICATION_SETTINGS_STATE_STATUS(state, status) {
    state.developerNotificationSettings = status;
  }
};

const actions = {
  loadNotificatonSettings({ commit, getters }) {
    commit("UPDATE_DEVELOPER_NOTIFICATION_SETTINGS_STATE_STATUS", "loading");
    API().requestNotificationSettings(getters.userId)
      .then(response => {
        commit("UPDATE_NOTIFICATION_SETTINGS", response.data);
        commit(
          "UPDATE_DEVELOPER_NOTIFICATION_SETTINGS_STATE_STATUS",
          "available"
        );
      })
      .catch(() => {
        window.console.log("failed to load data");
      });
  },
  changeNotificatonSettings({ commit, getters }) {
    commit("UPDATE_DEVELOPER_NOTIFICATION_SETTINGS_STATE_STATUS", "loading");
    API().putNotificationSettings(getters.userId, this.developerNotificationSettings)
      .then(() => {
        commit("UPDATE_NOTIFICATION_SETTINGS_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_NOTIFICATION_SETTINGS_STATE_STATUS", "failed");
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
