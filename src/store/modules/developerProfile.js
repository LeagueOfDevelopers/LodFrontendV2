import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  developerProfile: {},
  developerProfileStateStatus: statuses.available
};

const getters = {
  profile: state => state.developerProfile,
  profileStateStatus: state => state.developerProfileStateStatus
};

const mutations = {
  UPDATE_DEVELOPER_PROFILE(state, profile) {
    state.developerProfile = profile;
  },
  UPDATE_DEVELOPER_PROFILE_STATE_STATUS(state, status) {
    state.developerProfileStateStatus = status;
  }
};

const actions = {
  loadProfileData({ commit, getters }) {
    commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", "loading");
    API()
      .get(`developers/${getters.userId}`)
      .then(response => {
        const profileData = {
          Image: response.data.Image,
          VkProfileUri: response.data.VkProfileUri,
          LinkToGithubProfile: response.data.LinkToGithubProfile,
          PhoneNumber: response.data.PhoneNumber,
          StudentAccessionYear: response.data.StudentAccessionYear,
          IsGraduated: response.data.IsGraduated,
          StudyingDirection: response.data.StudyingDirection,
          InstituteName: response.data.InstituteName,
          Specialization: response.data.Specialization
        };
        commit("UPDATE_DEVELOPER_PROFILE", profileData);
        commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", "failed");
      });
  },
  changeProfileData({ commit, getters }) {
    commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", "loading");
    API()
      .put(`developers/${getters.userId}`)
      .then(() => {
        commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_DEVELOPER_PROFILE_STATE_STATUS", "failed");
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
