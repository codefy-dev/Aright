import { firebaseAuth, firebaseSignIn, firebaseOnAuthStateChanged, firebaseSignOut } from '../../boot/firebase';
import { Notify, Loading } from 'quasar'

export default {
  login (payload) {
    this.user.loading = true
    firebaseSignIn(firebaseAuth, payload.email, payload.password).then(response => {
      this.user = response.user
      this.user.loading = false
    }).catch((error) => {
      this.user.loading = false
      const errorCode = error.code;
      console.error(error)
      Notify.create({
        message: 'Ocurrió un error al intentar hacer login | ' + errorCode,
        type: 'negative'
      })
    });
  },
  logout () {
    firebaseSignOut(firebaseAuth).then(() => {
      this.user = {}
    }).catch((error) => {
      console.error(error)
    });
  },
  handleAuthStateChange () {
    firebaseOnAuthStateChanged(firebaseAuth, (user) => {
      this.user = { ...user, loading: false }
      this.router.push(this.user?.uid ? '/' : '/auth')
    });
  }
}
