import API from "../../api";
import { getComponentsInRowNumber } from "../../helpers";
import statuses from "../stateStatuses";

const state = {
  randomDevelopers: [],
  developers: [],
  developersNextPageNumber: 0,
  developerStateStatus: statuses.available
};

const getters = {
  randomDevelopers: state => state.randomDevelopers,
  developers: state => state.developers,
  developerStateStatus: state => state.developerStateStatus
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
  UPDATE_DEVELOPERS_NEXT_PAGE_NUMBER(state) {
    state.developersNextPageNumber = state.developersNextPageNumber + 1;
  },
  UPDATE_DEVELOPERS_STATE_STATUS(state, status) {
    state.developerStateStatus = statuses[status];
  }
};

const actions = {
  LOAD_RANDOM_DEVELOPERS({ commit }) {
    API()
      .get(`/developers/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_RANDOM_DEVELOPERS", response.data);
      });
  },
  LOAD_DEVELOPERS({ commit }) {
    if (state.developers.length !== 0) commit("RESET_DEVELOPERS");
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "loading");
    API()
      .get(`/developers?page=${state.developersNextPageNumber}`)
      .then(response => {
        commit("ADD_DEVELOPERS", response.data.Data);
        state.developers.length !== response.data.CountOfEntities
          ? commit("UPDATE_DEVELOPERS_NEXT_PAGE_NUMBER")
          : commit("UPDATE_DEVELOPERS_STATE_STATUS", "unavailable");
      })
      .catch(() => {
        commit("UPDATE_DEVELOPERS_STATE_STATUS", "failed");
      });
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "available");
  },
  LOAD_MORE_DEVELOPERS({ commit }) {
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "loading");
    API()
      .get(`/developers?page=${state.developersNextPageNumber}`)
      .then(response => {
        commit("ADD_DEVELOPERS", response.data.Data);
        state.developers.length !== response.data.CountOfEntities
          ? commit("UPDATE_DEVELOPERS_NEXT_PAGE_NUMBER")
          : commit("UPDATE_DEVELOPERS_STATE_STATUS", "unavailable");
      })
      .catch(() => {
        commit("UPDATE_DEVELOPERS_STATE_STATUS", "failed");
      });
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "available");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
