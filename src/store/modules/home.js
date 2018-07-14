const state = {
  notificationsAmount: 0,
  user: {}
};

const getters = {
  notificationsAmount: state => state.notificationsAmount,
  userId: state => state.user.id
};

const mutations = {};

const actions = {};

export const home = {
  state,
  getters,
  mutations,
  actions
};
