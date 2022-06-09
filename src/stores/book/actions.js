import { firebaseDb } from '../../boot/firebase'
import { Loading, date } from 'quasar'
import { collection, query, getDocs, orderBy, addDoc, limit, startAfter } from "firebase/firestore";
import { userStore } from '../user/index.js'

export default {
  async fetchPage () {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (user.activedBook) {
      let booksRef = collection(firebaseDb, 'books', user.activedBook, 'lines')
      let q = this.pagination.page > 1 && this.pagination.pages[this.pagination.page] !== undefined ?
        query(booksRef, orderBy('created_at', 'desc'), limit(this.linesPerPage), startAfter(this.pagination.pages[this.pagination.page])) :
        query(booksRef, orderBy('created_at', 'desc'), limit(this.linesPerPage));
      const lines = await getDocs(q)
      if (!lines.empty) {
        this.pagination.pages[this.pagination.page + 1] = lines.docs[lines.docs.length - 1]
        lines.forEach(line => this.book.push({ ...line.data(), id: line.id }))
        this.pagination.lastPage = lines.size < this.linesPerPage
      } else {
        this.pagination.page = this.pagination.page !== 1 ? this.pagination.page - 1 : 1
        this.pagination.lastPage = true
      }
    }
  },
  async addLine (line) {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (!user.activedBook) {
      await this.addBook({ name: 'Personal' })
    }
    let newLine = {
      created_by: user.id,
      created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      balance: parseInt(this.balance) + parseInt(line.type === 'income' ? line.amount : line.amount * -1),
      ...line,
    }
    let bookCollection = collection(firebaseDb, 'books', user.activedBook, 'lines')
    let lastLine = await addDoc(bookCollection, newLine)
    this.book.unshift({ ...newLine, id: lastLine.id })
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
  },
  async nextPage () {
    this.pagination.page++
    await this.fetchPage()
  },
  leftMenuToggle () {
    this.leftMenu = !this.leftMenu
  }
}
