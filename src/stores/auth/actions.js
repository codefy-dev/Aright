import {
  firebaseAuth,
  firebaseSignIn,
  firebaseOnAuthStateChanged,
  firebaseSignOut,
  firebaseUpdateProfile,
  firebaseUpdatePassword,
  firebaseReauthenticate,
  firebaseEmailAuthProvider
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
        message: i18n.global.t('auth.problemTryingToLogin') + ' | ' + errorCode,
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
        message: i18n.global.t('auth.profileUpdated'),
        type: 'positive'
      })
      if (payload.passwords) {
        this.updatePassword(payload.passwords).catch(error => {
          Notify.create({
            message: i18n.global.t('auth.problemChangingPassword') + ' | ' + error.code,
            type: 'negative'
          })
        })
      }
    }).catch((error) => {
      this.user.loading = false
      console.error(error)
      Notify.create({
        message: i18n.global.t('auth.problemUpdatingProfile') + ' | ' + error.code,
        type: 'negative'
      })
    })
  },
  updatePassword (passwords) {
    return new Promise((resolve, reject) => {
      this.reauthenticate(passwords.current).then(() => {
        this.user.loading = true
        if (this.passwordStrength(passwords.new).score < 2) {
          reject({
            message: i18n.global.t('auth.passwordWeak'),
            code: i18n.global.t('auth.passwordWeak')
          })
        }
        firebaseUpdatePassword(firebaseAuth.currentUser, passwords.new).then(() => {
          this.user.loading = false
          Notify.create({
            message: i18n.global.t('auth.passwordUpdated'),
            type: 'positive'
          })
          resolve()
        }).catch((error) => {
          this.user.loading = false
          reject(error)
        })
      }).catch((error) => {
        this.user.loading = false
        reject(error)
      })
    })
  },
  reauthenticate (password) {
    return new Promise((resolve, reject) => {
      const credential = firebaseEmailAuthProvider.credential(this.user.email, password)
      firebaseReauthenticate(firebaseAuth.currentUser, credential).then(() => {
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },
  passwordStrength (password) {
    let score = zxcvbn(password || '').score
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
