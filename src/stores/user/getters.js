export default {
  async userInfo () {
    if (!this.user?.id) {
      await this.fetchUser()
    }
    return this.user
  },
  async activeBook () {
    return this.user?.activedBook ? this.user.books[this.user.activedBook] : {}
  }
}
