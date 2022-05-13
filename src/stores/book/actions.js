import { firebaseApp } from '../../boot/firebase'
import { Notify, Dialog, Loading, uid, date } from 'quasar'
import { getDatabase, ref, get, set, onValue, push } from "firebase/database"
import { authStore } from '../auth/index.js'

export default {
  fetchBook () {
    return new Promise((resolve, reject) => {
      Loading.show()
      let db = getDatabase(firebaseApp);
      let starCountRef = ref(db, 'book')
      onValue(starCountRef, (snapshot) => {
        let data = snapshot.val()
        this.setBook(data)
        Loading.hide()
        resolve()
      }, (error) => {
        this.book = []
        Loading.hide()
        reject(error)
      })
    })
  },
  setBook (book) {
    this.book = book ? Object.values(book).sort(function (a, b) {
      // ordenando de forma decrescente
      return new Date(b.created_at) - new Date(a.created_at);
    }) : []
  },
  addLine (line) {
    return new Promise((resolve, reject) => {
      Loading.show()
      const auth = authStore()
      let db = getDatabase(firebaseApp)
      let postListRef = ref(db, 'book')
      let newPostRef = push(postListRef)
      let data = {
        id: uid(),
        created_by: auth.user.uid,
        created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        balance: this.balance + (line.type === 'income' ? line.amount : -line.amount),
        ...line
      }
      console.log('addLine data', data)
      set(newPostRef, data).then(() => {
        Loading.hide()
        resolve()
      }).catch((error) => {
        Loading.hide()
        reject(error)
      })
    })
  },
  addTenant () {
    return new Promise((resolve, reject) => {
      Loading.show()
      let db = getDatabase(firebaseApp)
      let postListRef = ref(db, 'tenants')
      let newPostRef = push(postListRef)
      set(newPostRef, {
        created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        book: {}
      }).then((result) => {
        Loading.hide()
        resolve(result)
      }).catch((error) => {
        Loading.hide()
        reject(error)
      })
    })
  }
}
