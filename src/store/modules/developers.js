import API from "../../api";

import statuses from "../stateStatuses";

const state = {
  searchValue: "",
  randomDevelopers: [],
  developers: [],
  developersStateStatus: statuses.available,
  developersOnPageCount: 10,
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
    state.allDevelopersCount = 0;
  },
  UPDATE_DEVELOPERS_STATE_STATUS(state, status) {
    state.developersStateStatus = statuses[status];
  },
  UPDATE_ALL_DEVELOPERS_COUNT(state, count) {
    state.allDevelopersCount = count;
  },
  UPDATE_SEARCH_VALUE(state, value) {
    state.searchValue = value;
  }
};

const actions = {
  async LOAD_RANDOM_DEVELOPERS({ commit }) {
    try {
      const developers = await API.getRandomDevelopers();
      commit("UPDATE_RANDOM_DEVELOPERS", developers);
    }
    catch {
      commit("UPDATE_DEVELOPERS_STATE_STATUS", "failed");
    }
  },

  RESET_DEVELOPERS({ commit }) {
    const {developers, allDevelopersCount} = state;
    if (developers.length || allDevelopersCount)
      commit("RESET_DEVELOPERS");
  },

  async LOAD_DEVELOPERS({ commit }, count = state.developersOnPageCount) {
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "loading");

    try {
      const res = state.searchValue.length ?
        await API.getFilteredDevelopers(count, state.developers.length, state.searchValue) :
        await API.getDevelopers(count, state.developers.length);

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

  LOAD_MORE_DEVELOPERS({ dispatch }) {
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

  FILTER_DEVELOPERS({ commit, dispatch }, searchValue) {
    commit("RESET_DEVELOPERS");
    commit("UPDATE_SEARCH_VALUE", searchValue);

    dispatch("LOAD_DEVELOPERS");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
