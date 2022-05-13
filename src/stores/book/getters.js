export default {
  balance (state) {
    return state?.book[0]?.balance ?? 0
  }
}
