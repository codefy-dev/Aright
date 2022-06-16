import { defineStore } from 'pinia';
import actions from './actions';
import getters from './getters'

export const authStore = defineStore('auth', {
  state: () => ({
    user: {
      loading: true
    }
  }),
  actions,
  getters
});
