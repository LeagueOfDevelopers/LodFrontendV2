import API from "../../api";
import statuses from "../stateStatuses";
import {requestRandomDevelopers, requestDevelopers} from "../../requestApi";

const state = {
  randomDevelopers: [],
  developers: [],
  developersNextPageNumber: 0,
  developersStateStatus: statuses.available
};

const getters = {
  randomDevelopers: state => state.randomDevelopers,
  developers: state => state.developers,
  developersStateStatus: state => state.developersStateStatus
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
    state.developersStateStatus = statuses[status];
  }
};

const actions = {
  LOAD_RANDOM_DEVELOPERS({commit}) {
    requestRandomDevelopers()
      .then(response => {
        commit("UPDATE_RANDOM_DEVELOPERS", response);
      })
  },
  LOAD_DEVELOPERS({commit}) {
    if (state.developers.length !== 0) commit("RESET_DEVELOPERS");
    commit("UPDATE_DEVELOPERS_STATE_STATUS", "loading");
    requestDevelopers(state.developersNextPageNumber)
      .then(response => {
        commit("ADD_DEVELOPERS", response);
        if (state.developers.length !== response.data.CountOfEntities) {
          commit("UPDATE_DEVELOPERS_NEXT_PAGE_NUMBER");
          commit("UPDATE_DEVELOPERS_STATE_STATUS", "available");
        } else {
          commit("UPDATE_DEVELOPERS_STATE_STATUS", "unavailable");
        }
      })
      .catch(() => {
        commit("UPDATE_DEVELOPERS_STATE_STATUS", "failed");
      });
  },
  LOAD_MORE_DEVELOPERS({commit}) {
    if (state.developersStateStatus === "available") {
      commit("UPDATE_DEVELOPERS_STATE_STATUS", "loading");
      API()
        .get(`/developers?page=${state.developersNextPageNumber}`)
        .then(response => {
          commit("ADD_DEVELOPERS", response.data.Data);
          if (state.developers.length !== response.data.CountOfEntities) {
            commit("UPDATE_DEVELOPERS_NEXT_PAGE_NUMBER");
            commit("UPDATE_DEVELOPERS_STATE_STATUS", "available");
          } else {
            commit("UPDATE_DEVELOPERS_STATE_STATUS", "unavailable");
          }
        })
        .catch(() => {
          commit("UPDATE_DEVELOPERS_STATE_STATUS", "failed");
        });
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
