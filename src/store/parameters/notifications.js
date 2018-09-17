const state = {
  notifications: [],
  notificationsAmount: 0
};

const getters = {
  notificationsAmount: state => state.notificationsAmount
};

export default {
  state,
  getters
};
