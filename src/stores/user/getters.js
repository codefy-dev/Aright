export default {
  async userInfo () {
    if (!this.user?.id) {
      await this.fetchUser()
    }
    return this.user
  }
}
