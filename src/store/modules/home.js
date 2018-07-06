const state = {
  notificationsAmount: 0,
  user: {}
};

const getters = {
  getNotificationsAmount: state => state.notificationsAmount,
  getUserId: state => state.user.id
};

const mutations = {};

const actions = {};

export const home = {
  state,
  getters,
  mutations,
  actions
};
