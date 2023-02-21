import { defineStore } from 'pinia';
import getters from './getters'
import actions from './actions'

export const bookStore = defineStore('book', {
  state: () => ({
    book: [],
    pagination: {
      minPerPage: 15,
      page: 1,
      pages: [],
      lastPage: false,
    },
    leftMenu: false,
    tab: 'records',
    maxMembers: 5,
  }),
  getters,
  actions,
});
