const state = {
  user: {
    id: 1
  }
};

const getters = {
  userId: state => state.user.id
};

export default {
  state,
  getters
};
