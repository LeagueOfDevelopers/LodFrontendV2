import API from "../../api";
import statuses from "../stateStatuses";

const state = {
  portfolio: {},
  portfolioStateStatus: statuses.available
};

const getters = {
  portfolio: state => state.portfolio,
  portfolioStateStatus: state => state.portfolioStateStatus
};

const mutations = {
  UPDATE_PORTFOLIO(state, portfolio) {
    state.portfolio = portfolio;
  },
  UPDATE_PORTFOLIO_STATE_STATUS(state, status) {
    state.portfolioStateStatus = status;
  }
};

const actions = {
  loadPortfolio({ commit }, userId) {
    commit("UPDATE_PORTFOLIO_STATE_STATUS", "loading");
    API()
      .get(`developers/${userId}`)
      .then(response => {
        const portfolioData = {
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
        commit("UPDATE_PORTFOLIO", portfolioData);
        commit("UPDATE_PORTFOLIO_STATE_STATUS", "succeeded");
      })
      .catch(() => {
        commit("UPDATE_PORTFOLIO_STATE_STATUS", "failed");
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
