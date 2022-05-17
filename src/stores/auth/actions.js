import { firebaseAuth, firebaseSignIn, firebaseOnAuthStateChanged, firebaseApp, firebaseSignOut } from '../../boot/firebase';
import { Notify, Loading, Dialog } from 'quasar'
import { getFirestore, collection, getDoc, doc, setDoc } from 'firebase/firestore/lite';
import { bookStore } from '../book/index.js'

export default {
  login (payload) {
    Loading.show()
    firebaseSignIn(firebaseAuth, payload.email, payload.password).then(response => {
      this.user = response.user
      this.getUserData()
      Loading.hide()
    }).catch((error) => {
      Loading.hide()
      const errorCode = error.code;
      console.log(error)
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
      this.router.push(user ? '/' : '/auth')
    });
  },
  async getUserData () {
    const db = getFirestore(firebaseApp)
    let usersRef = doc(db, "users", this.user.email)
    const docSnap = await getDoc(usersRef)
    if (docSnap.exists()) {
      this.user.data = docSnap.data()
    } else {
      usersRef = doc(db, "users", this.user.email)
      this.user.data = {}
    }

  },

}
