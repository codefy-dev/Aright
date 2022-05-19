import { firebaseDb } from '../../boot/firebase'
import { Loading, uid, date } from 'quasar'
import { collection, query, where, getDocs, doc, setDoc, orderBy } from "firebase/firestore";
import { userStore } from '../user/index.js'

export default {
  async fetchBook () {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    let booksRef = collection(firebaseDb, "books")
    let q = query(booksRef, where('uid_book', '==', user.activedBook), orderBy('created_at', 'desc'))
    const bookSnaps = await getDocs(q)
    this.book = []
    bookSnaps.forEach((bookSnap) => {
      this.book.push(bookSnap.data())
    })
    Loading.hide()
  },
  async addLine (line) {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    let id = uid()
    let newLine = {
      id,
      uid_book: user.activedBook,
      created_by: user.id,
      created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      balance: parseInt(this.balance) + parseInt(line.type === 'income' ? line.amount : line.amount * -1),
      ...line,
    }
    let booksRef = doc(firebaseDb, "books", id)
    console.log(booksRef, newLine, line)
    await setDoc(booksRef, newLine)
    await this.fetchBook()
    Loading.hide()
  }
}
