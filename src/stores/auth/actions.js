import { firebaseAuth, firebaseSignIn, firebaseOnAuthStateChanged, firebaseApp, firebaseSignOut } from '../../boot/firebase';
import { Notify, Loading } from 'quasar'
import { getDatabase, ref, child, get, set } from "firebase/database";
import { bookStore } from '../book/index.js'

export default {
  // method to login with firebase
  login (payload) {
    Loading.show()
    firebaseSignIn(firebaseAuth, payload.email, payload.password).then(response => {
      this.user = response.user
      const dbRef = ref(getDatabase(firebaseApp));
      get(child(dbRef, 'users/' + this.user.uid)).then((snapshot) => {
        if (!snapshot.exists()) {
          set(child(dbRef, 'users/' + this.user.uid), {
            id: this.user.uid,
            email: this.user.email,
            tenants: {}
          });
        }
        else if (!snapshot.val().tenants) {
          const storeBook = bookStore()
          storeBook.addTenant().then((result) => {
            console.log('snapshotUser', snapshot.val(), result)
          })
        }
      }).catch((error) => {
        Notify.create({
          message: 'Recuperando Datos de Usuario | ' + error.message,
          type: 'negative'
        })
        console.log('login error', error)
      });
      Loading.hide()
    }).catch((error) => {
      Loading.hide()
      const errorCode = error.code;
      // const errorMessage = error.message;
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
      if (user) {
        this.user = user
        this.router.push('/')
      } else {
        this.user = {}
        this.router.push('/auth')
      }
    });
  }

}
