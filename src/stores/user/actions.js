import { firebaseDb } from '../../boot/firebase'
import { Loading } from 'quasar'
import { getDoc, doc, setDoc } from "firebase/firestore";
import { authStore } from '../auth/index.js'

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
      Loading.show()
      let data = {
        id: auth.user.uid,
        displayName: auth.user.displayName,
        email: auth.user.email,
        photoURL: auth.user.photoURL,
        phoneNumber: auth.user.phoneNumber,
        books: {}
      }
      let usersRef = doc(firebaseDb, 'users', auth.user.uid)
      await setDoc(usersRef, data)
      this.user = data
    }
    Loading.hide()
  },
  async updateUser () {
    const auth = authStore()
    if (auth.user?.uid) {
      Loading.show()
      let usersRef = doc(firebaseDb, 'users', auth.user.uid)
      await setDoc(usersRef, this.user)
      Loading.hide()
    }
  }
}
