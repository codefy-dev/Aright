import {
  firebaseAuth,
  firebaseSignInEmailPassword,
  firebaseOnAuthStateChanged,
  firebaseSignOut,
  firebaseUpdateProfile,
  firebaseUpdatePassword,
  firebaseReauthenticate,
  firebaseEmailAuthProvider,
  firebaseStorage,
  firebaseActionCodeSettings,
  firebaseSignInLink,
  // firebaseSignInGoogle
} from '../../boot/firebase';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Notify, Dark } from 'quasar'
import { i18n } from '../../boot/i18n';
import zxcvbn from 'zxcvbn'
import md5 from 'md5'

const $t = i18n.global.t;

export default {
  login (payload) {
    this.user.loading = true
    switch (payload.type) {
      case 'google':
        this.loginGoogle()
        break;
      case 'apple':
        this.loginApple()
        break;
      case 'emailPassword':
        this.loginEmailPassword(payload)
        break;
      case 'link':
        this.loginLink(payload)
        break;
      default:
        this.user.loading = false
        break;
    }
    this.user.loading = false
  },
  loginGoogle () {
    // firebaseSignInGoogle(firebaseAuth).then(response => {
    //   this.user = response.user
    // }).catch((error) => {
    //   const errorCode = error.code;
    //   console.error(error)
    //   Notify.create({
    //     message: $t('auth.problemTryingToLogin') + ' | ' + errorCode,
    //     type: 'negative'
    //   })
    // });
  },
  loginApple () {
    Notify.create({
      message: $t('auth.appleNotImplemented'),
      type: 'negative'
    })
  },
  loginEmailPassword (payload) {
    firebaseSignInEmailPassword(firebaseAuth, payload.email, payload.password).then(response => {
      this.user = response.user
    }).catch((error) => {
      const errorCode = error.code;
      console.error(error)
      Notify.create({
        message: $t('auth.problemTryingToLogin') + ' | ' + errorCode,
        type: 'negative'
      })
    });
  },
  loginLink (payload) {
    firebaseSignInLink(firebaseAuth, payload.email, firebaseActionCodeSettings).then(() => {
      Notify.create({
        message: $t('auth.checkYourEmail'),
        type: 'positive',
        timeout: 20000
      })
    }).catch((error) => {
      const errorCode = error.code;
      console.error(error)
      Notify.create({
        message: $t('auth.problemTryingToLogin') + ' | ' + errorCode,
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
      Dark.set(this.darkMode)
      this.router.push(this.user?.uid ? '/' : '/auth')
    });
  },
  updateProfile (payload) {
    this.user.loading = true
    firebaseUpdateProfile(firebaseAuth.currentUser, payload).then(() => {
      this.user.loading = false
      Notify.create({
        message: $t('auth.profileUpdated'),
        type: 'positive'
      })
      if (payload.passwords) {
        this.updatePassword(payload.passwords).catch(error => {
          Notify.create({
            message: $t('auth.problemChangingPassword') + ' | ' + error.code,
            type: 'negative'
          })
        })
      }
    }).catch((error) => {
      this.user.loading = false
      console.error(error)
      Notify.create({
        message: $t('auth.problemUpdatingProfile') + ' | ' + error.code,
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
            message: $t('auth.passwordWeak'),
            code: $t('auth.passwordWeak')
          })
        }
        firebaseUpdatePassword(firebaseAuth.currentUser, passwords.new).then(() => {
          this.user.loading = false
          Notify.create({
            message: $t('auth.passwordUpdated'),
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
      text: $t('auth.passwordStrength', { score }),
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
  },
  uploadAvatar (avatar) {
    return new Promise((resolve, reject) => {
      this.user.loading = true
      const storageRef = ref(firebaseStorage, `users/${this.user.uid}/avatar/avatar.jpeg`)
      this.resizeBase64Image(avatar).then(resized => {
        uploadString(storageRef, resized, 'data_url').then(() => {
          getDownloadURL(storageRef).then(photoURL => {
            this.user.photoURL = this.updateParamsUrl(photoURL, { dark: this.darkMode, lang: this.language })
            this.updateProfile({ photoURL: this.user.photoURL })
            this.user.loading = false
            resolve()
          })
        }).catch((error) => {
          this.user.loading = false
          reject(error)
        })
      })
    })
  },
  resizeBase64Image (base64, width = 200) {
    return new Promise((resolve, reject) => {
      var img = new Image()
      img.src = base64
      img.onload = (el) => {
        var elem = document.createElement('canvas')
        var scaleFactor = width / el.target.width
        elem.width = width
        elem.height = el.target.height * scaleFactor
        var ctx = elem.getContext('2d')
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height)
        resolve(ctx.canvas.toDataURL('image/jpeg', 0.8))
      }
    })
  },
  updateParamsUrl (url, params) {
    url = url || 'https://www.gravatar.com/avatar/' + md5(this.user.email)
    url = new URL(url)
    for (const param in params) {
      url.searchParams.set(param, params[param])
    }
    return new URL(
      `${url.origin}${url.pathname}?${new URLSearchParams([
        ...Array.from(url.searchParams.entries())
      ]).toString()}`
    ).href
  },
  toggleDarkMode () {
    Dark.toggle()
    this.user.photoURL = this.updateParamsUrl(this.user.photoURL, { dark: !this.darkMode })
    this.updateProfile({ photoURL: this.user.photoURL })
  }
}
