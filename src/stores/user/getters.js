export default {
  async userInfo () {
    if (!this.user?.id) {
      await this.fetchUser()
    }
    return this.user
  },
  activeBook (state) {
    return state.user?.activedBook ? state.user.books[state.user.activedBook] : {}
  },
  activedBookIsMultiBalance () {
    return this.activeBook?.multi_balance !== undefined ? this.activeBook.multi_balance : false
  },
  hasBooks (state) {
    return state.user?.books?.length !== 0
  },
  isOwner (state) {
    return state.user?.id === this.activeBook?.created_by
  }
}
