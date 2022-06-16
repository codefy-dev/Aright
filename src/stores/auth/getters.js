
export default {
  darkMode (state) {
    let url = new URL(state?.user?.photoURL ?? '')
    return url.searchParams.get('dark') === 'true'
  },
  language (state) {
    let url = new URL(state?.user?.photoURL ?? '')
    return url.searchParams.get('lang') ?? 'en'
  }
}
