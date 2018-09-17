const state = {
  categories: [
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
  ]
};

const getters = {
  categories: state => state.categories,
  selectedCategoryIndexes: state =>
    state.categories.reduce((selectedCategories, category) => {
      if (category.status) selectedCategories.push(category.index);
      return selectedCategories;
    }, [])
};

const mutations = {
  UPDATE_CATEGORY_INDEXES(state, categoryIndex) {
    const category = state.categories.find(
      category => category.index == categoryIndex
    );
    category.status = !category.status;
  }
};

const actions = {
  SELECT_CATEGORY({ dispatch, commit }, categoryIndex) {
    commit("UPDATE_CATEGORY_INDEXES", categoryIndex);
    dispatch("LOAD_PROJECTS");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
