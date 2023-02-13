import { firebaseDb } from '../../boot/firebase'
import { Loading, Dialog } from 'quasar'
import { getDoc, doc, setDoc } from "firebase/firestore";
import { authStore } from '../auth/index.js'
import { i18n } from '../../boot/i18n';

export default {
  async fetchUser () {
    const auth = authStore()
    if (auth.user?.uid) {
      let usersRef = doc(firebaseDb, 'users', auth.user.uid)
      const docSnap = await getDoc(usersRef)
      if (docSnap.exists()) {
        let data = docSnap.data()
        const books = new Map(Object.entries(data.books));
        data.displayName = auth.user.displayName
        data.photoURL = auth.user.photoURL
        data.email = auth.user.email
        data.phoneNumber = auth.user.phoneNumber
        this.user = {
          activedBook: [...books.values()].find(book => book.active)?.uid,
          ...data
        }
      } else {
        await this.createUser()
      }
    }
  },
  async createUser () {
    const auth = authStore()
    if (auth.user?.uid) {
      let displayName = auth.user.displayName || auth.user.email.split('@')[0]
      let data = {
        id: auth.user.uid,
        displayName,
        email: auth.user.email,
        photoURL: auth.user.photoURL || null,
        phoneNumber: auth.user.phoneNumber,
        books: {}
      }
      if (displayName === auth.user.email.split('@')[0]) {
        Dialog.create({
          title: i18n.global.t('auth.newUserWhatsYourDisplayName'),
          message: i18n.global.t('auth.newUserWhatsYourDisplayNameMessage'),
          prompt: {
            model: '',
            type: 'text'
          },
          cancel: true,
          persistent: true
        }).onOk(name => {
          data.displayName = name
          this.saveNewUser(data)
        }).onCancel(() => {
          this.saveNewUser(data)
        })
      } else {
        await this.saveNewUser(data)
      }

    }
  },
  async updateUser () {
    const auth = authStore()
    if (auth.user?.uid) {
      Loading.show()
      let usersRef = doc(firebaseDb, 'users', auth.user.uid)
      this.user.displayName = this.user.displayName !== auth.user.displayName ? auth.user.displayName : this.user.displayName
      this.user.activedBook = this.user.activedBook !== undefined ? this.user.activedBook : null
      await setDoc(usersRef, this.user)
      Loading.hide()
    }
  },
  async saveNewUser (data) {
    Loading.show()
    const auth = authStore()
    data.displayName = data.displayName || auth.user.email.split('@')[0]
    if (data.displayName !== auth.user.displayName) {
      await auth.updateProfile({ displayName: data.displayName })
    }
    let usersRef = doc(firebaseDb, 'users', data.id)
    await setDoc(usersRef, data)
    this.user = data
    Loading.hide()
  }
}
