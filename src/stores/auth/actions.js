import { firebaseAuth, firebaseSignIn, firebaseOnAuthStateChanged, firebaseApp, firebaseSignOut } from '../../boot/firebase';
import { Notify, Loading } from 'quasar'

export default {
  login (payload) {
    Loading.show()
    firebaseSignIn(firebaseAuth, payload.email, payload.password).then(response => {
      this.user = response.user
      Loading.hide()
    }).catch((error) => {
      Loading.hide()
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
      this.user = user
      this.router.push(this.user?.uid ? '/' : '/auth')
    });
  }
}
