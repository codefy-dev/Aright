import { defineStore } from 'pinia';
import getters from './getters'
import actions from './actions'

export const userStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  actions,
  getters
});
