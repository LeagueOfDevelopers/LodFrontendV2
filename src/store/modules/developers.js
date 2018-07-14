import API from "../../api.js";
import { getComponentsInRowNumber } from "../../helpers.js";

const state = {
  developers: []
};

const getters = {
  developers: state => state.developers
};

const mutations = {
  UPDATE_DEVELOPERS(state, developers) {
    state.developers = developers;
  }
};

const actions = {
  LOAD_DEVELOPERS({ commit }) {
    API()
      .get(`/developers/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_DEVELOPERS", response.data);
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
