import { defineStore } from 'pinia';
import getters from './getters'
import actions from './actions'

export const bookStore = defineStore('book', {
  state: () => ({
    book: [],
    pagination: {
      page: 1,
      pages: [],
      lastPage: false,
    }
  }),
  getters,
  actions,
});
