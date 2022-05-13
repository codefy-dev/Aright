import { defineStore } from 'pinia';
import actions from './actions';

export const authStore = defineStore('auth', {
  state: () => ({
    user: {}
  }),
  actions,
});
