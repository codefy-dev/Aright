import {
  firebaseAuth,
  firebaseSignIn,
  firebaseOnAuthStateChanged,
  firebaseSignOut,
  firebaseUpdateProfile,
  firebaseUpdatePassword
} from '../../boot/firebase';
import { Notify, Quasar as q } from 'quasar'
import { i18n } from '../../boot/i18n';
import zxcvbn from 'zxcvbn'


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
  },
  updateProfile (payload) {
    this.user.loading = true
    firebaseUpdateProfile(firebaseAuth.currentUser, payload).then(() => {
      this.user.loading = false
      Notify.create({
        message: 'Datos actualizados correctamente',
        type: 'positive'
      })
    }
    ).catch((error) => {
      this.user.loading = false
      const errorCode = error.code;
      console.error(error)
      Notify.create({
        message: 'Ocurrió un error al intentar actualizar los datos | ' + errorCode,
        type: 'negative'
      })
    })
  },
  passwordStrength (password) {
    let score = zxcvbn(password || '').score
    console.log(i18n, q)
    return {
      score,
      color: ['red', 'red', 'deep-orange', 'orange', 'green'][score],
      text: i18n.global.t('auth.passwordStrength', { score }),
      values: Array(5).fill().map((_, idx) => {
        if (score == 0 || score < idx - 1) {
          return 0
        }
        if (score >= idx) {
          return 1
        }
        return 0.1
      })
    }
  }
}
