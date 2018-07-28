import API from "../../api.js";
import { getComponentsInRowNumber } from "../../helpers.js";

const state = {
  randomDevelopers: [],
  developers: []
};

const getters = {
  randomDevelopers: state => state.randomDevelopers,
  developers: state => state.developers
};

const mutations = {
  UPDATE_RANDOM_DEVELOPERS(state, randomDevelopers) {
    state.randomDevelopers = randomDevelopers;
  },
  UPDATE_DEVELOPERS(state, developers) {
    state.developers = developers;
  }
};

const actions = {
  LOAD_RANDOM_DEVELOPERS({ commit }) {
    API()
      .get(`/developers/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_RANDOM_DEVELOPERS", response.data);
      });
    /* .catch(error => console.log(error)); */
  }
};

export const developers = {
  state,
  getters,
  mutations,
  actions
};
