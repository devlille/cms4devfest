import Vue from 'vue';
import Vuex from 'vuex';
import notification from './modules/Notification';
import confirmDialog from './modules/ConfirmDialog';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    notification,
    confirmDialog
  },
  strict: debug,
});
