import { firebaseDb } from '../../boot/firebase'
import { Loading } from 'quasar'
import { getDoc, doc } from "firebase/firestore";
import { authStore } from '../auth/index.js'

export default {
  async fetchUser () {
    Loading.show()
    const auth = authStore()
    if (auth.user?.uid) {
      let usersRef = doc(firebaseDb, "users", auth.user.uid)
      const docSnap = await getDoc(usersRef)
      if (docSnap.exists()) {
        let data = docSnap.data()
        this.user = {
          id: auth.user.uid,
          displayName: auth.user.displayName,
          email: auth.user.email,
          photoURL: auth.user.photoURL,
          phoneNumber: auth.user.phoneNumber,
          activedBook: data.books.find(book => book.active).uid,
          ...data
        }
      }
    }
    Loading.hide()
  }
}
