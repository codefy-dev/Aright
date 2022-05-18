import { firebaseAuth, firebaseSignIn, firebaseOnAuthStateChanged, firebaseApp, firebaseSignOut } from '../../boot/firebase';
import { Notify, Loading } from 'quasar'
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore/lite';

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
      let data = {
        books: [],
      }
      await setDoc(usersRef, data)
      this.user.data = data
    }

  },

}
