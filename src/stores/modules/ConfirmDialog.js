const state = {
  active: false,
  action: undefined
};

const getters = {};

const actions = {};

const mutations = {
  setConfirmDialog(state, confirmDialog) {
    state.active = confirmDialog.active;
    state.action = confirmDialog.action;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
