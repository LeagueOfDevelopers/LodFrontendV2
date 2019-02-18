import API from "../../api";

import statuses from "../stateStatuses";

const state = {
  searchValue: "",
  randomDevelopers: [],
  developers: [],
  developersStateStatus: statuses.available,
  developersOnPageCount: 20,
  allDevelopersCount: 0
};

const getters = {

};

const mutations = {
  UPDATE_RANDOM_DEVELOPERS(state, randomDevelopers) {
    state.randomDevelopers = randomDevelopers;
  },
  ADD_DEVELOPERS(state, developers) {
    state.developers = state.developers.concat(developers);
  },
  RESET_DEVELOPERS(state) {
    state.developers = [];
  },
  UPDATE_DEVELOPERS_CURRENT_PAGE(state) {
    state.developersCurrentPage = ++state.developersCurrentPage;
  },
  UPDATE_DEVELOPERS_STATE_STATUS(state, status) {
    state.developersStateStatus = statuses[status];
  },
  UPDATE_ALL_DEVELOPERS_COUNT(state, count) {
    state.allDevelopersCount = count;
  },
  UPDATE_SEARCH_VALUE(state, newValue) {
    state.searchValue = newValue;
  }
};

const actions = {
  LOAD_RANDOM_DEVELOPERS({ commit }) {
    API.getRandomDevelopers()
      .then(response => {
        commit("UPDATE_RANDOM_DEVELOPERS", response);
      })
  },

  RESET_DEVELOPERS({ commit }) {
    commit("RESET_DEVELOPERS");
  },

  async LOAD_DEVELOPERS({ commit }, count = state.developersOnPageCount) {
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "loading");

    try {
      const res = await API.getDevelopers(count, state.developers.length);

      commit("ADD_DEVELOPERS", res.developers);
      commit("UPDATE_ALL_DEVELOPERS_COUNT", res.allDevelopersCount);

      const developerStateStatus = state.developers.length < state.allDevelopersCount ?
        "available" : "unavailable";

      commit("UPDATE_DEVELOPERS_STATE_STATUS", developerStateStatus);
    }
    catch {
      commit("UPDATE_DEVELOPERS_STATE_STATUS", "failed");
    }
  },

  async LOAD_MORE_DEVELOPERS({ dispatch }) {
    const {
      developers,
      allDevelopersCount,
      developersOnPageCount,
      developersStateStatus
    } = state;

    if (developersStateStatus === "unavailable") return;

    const developersLeft = allDevelopersCount - developers.length;

    if (developersLeft > developersOnPageCount)
      dispatch("LOAD_DEVELOPERS");
    else
      dispatch("LOAD_DEVELOPERS", developersLeft);
  },

  FILTER_DEVELOPERS({ commit }, searchValue) {
    commit("UPDATE_SEARCH_VALUE", searchValue);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
