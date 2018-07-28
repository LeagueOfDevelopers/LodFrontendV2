import API from "../../api.js";
import store from "../index.js";
import { getComponentsInRowNumber } from "../../helpers.js";

const defaultCategories = [
  {
    name: "Веб",
    status: false,
    index: 0
  },
  {
    name: "Мобильное",
    status: false,
    index: 1
  },
  {
    name: "Десктопное",
    status: false,
    index: 2
  },
  {
    name: "Игра",
    status: false,
    index: 3
  },
  {
    name: "Прочее",
    status: false,
    index: 4
  }
];

const state = {
  randomProjects: [],
  projects: [],
  projectsNumber: 0,
  rowsNumber: 0,
  categories: defaultCategories,
  selectedCategoryIndexes: []
};

const getters = {
  randomProjects: state => state.randomProjects,
  projects: state => state.projects,
  rowsNumber: state => state.rowsNumber,
  projectsNumber: state => state.projects.length,
  categories: state => state.categories,
  selectedCategoryIndexes: state => state.selectedCategoryIndexes
};

const mutations = {
  UPDATE_RANDOM_PROJECTS(state, randomProjects) {
    state.randomProjects = randomProjects;
  },
  UPDATE_PROJECTS(state, projects) {
    state.projects = projects;
    window.console.log(state.projects);
  },
  UPDATE_ROWS_NUMBER(state, rowsNumber) {
    state.rowsNumber = rowsNumber;
  },
  UPDATE_CATEGORY_INDEXES(state, categoryIndex) {
    const category = state.categories.find(
      category => category.index == categoryIndex
    );
    category.status = !category.status;
  },
  UPDATE_SELECTED_CATEGORY_INDEXES(state) {
    state.selectedCategoryIndexes = state.categories.reduce(
      (indexes, category) => {
        if (category.status) indexes.push(category.index);
        return indexes;
      },
      []
    );
  }
};

const actions = {
  LOAD_RANDOM_PROJECTS({ commit }) {
    API()
      .get(`/projects/random/${getComponentsInRowNumber()}`)
      .then(response => {
        commit("UPDATE_RANDOM_PROJECTS", response.data);
      });
  },
  LOAD_PROJECTS({ commit }) {
    const selectedCategories = state.selectedCategoryIndexes.join(",");
    const componentsInRowNumber = getComponentsInRowNumber();
    API()
      .get(
        `/projects/${
          state.projectsNumber
        }/${componentsInRowNumber}?&categories=${selectedCategories}`
      )
      .then(response => {
        commit("UPDATE_PROJECTS", response.data.Data);
        const rowsNumber = Math.ceil(
          response.data.CountOfEntities / componentsInRowNumber
        );
        commit("UPDATE_ROWS_NUMBER", rowsNumber);
      });
  },
  SELECT_CATEGORY({ commit }, categoryIndex) {
    commit("UPDATE_CATEGORY_INDEXES", categoryIndex);
    commit("UPDATE_SELECTED_CATEGORY_INDEXES");
    store.dispatch("LOAD_PROJECTS");
  }
};

export const projects = {
  state,
  getters,
  mutations,
  actions
};
