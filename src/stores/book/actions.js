import { firebaseDb } from '../../boot/firebase'
import { Loading, uid, date } from 'quasar'
import { collection, query, getDocs, doc, setDoc, orderBy, addDoc } from "firebase/firestore";
import { userStore } from '../user/index.js'

export default {
  async fetchBook () {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    this.book = []
    if (!user.activedBook) {
      return
    }
    let booksRef = collection(firebaseDb, 'books', user.activedBook, 'lines')
    let q = query(booksRef, orderBy('created_at', 'desc'))
    const bookSnaps = await getDocs(q)
    bookSnaps.forEach((bookSnap) => {
      this.book.push(bookSnap.data())
    })
    Loading.hide()
  },
  async addLine (line) {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (!user.activedBook) {
      await this.addBook({
        name: 'Personal'
      })
    }
    let id = uid()
    let newLine = {
      id,
      created_by: user.id,
      created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      balance: parseInt(this.balance) + parseInt(line.type === 'income' ? line.amount : line.amount * -1),
      ...line,
    }
    let booksRef = doc(firebaseDb, 'books', user.activedBook, 'lines', id)
    await setDoc(booksRef, newLine)
    await this.fetchBook()
    Loading.hide()
  },
  async addBook (book) {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    let newBook = {
      created_by: user.id,
      created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      members: [user.id],
      ...book,
    }
    let booksCollection = collection(firebaseDb, 'books')
    let bookReff = await addDoc(booksCollection, newBook)
    storedUser.user.activedBook = bookReff.id
    storedUser.user.books[bookReff.id] = {
      name: book.name,
      id: bookReff.id,
      active: true
    }
    await storedUser.updateUser()
    this.book = []
    Loading.hide()
  }
}
