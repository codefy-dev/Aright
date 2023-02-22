import { firebaseDb } from '../../boot/firebase'
import { Loading, date, Screen, Notify } from 'quasar'
import { collection, query, getDocs, orderBy, addDoc, limit, startAfter, setDoc, doc } from "firebase/firestore";
import { userStore } from '../user/index.js'
import { i18n } from '../../boot/i18n';

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
        this.pagination.lastPage = lines.empty && this.pagination.page !== 1
      }
    }
  },
  async addLine (line) {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (!user.activedBook) { // If user has no book, create a personal book
      await this.addBook({
        name: 'Personal',
        icon: 'book',
        multi_balance: false
      })
    }
    let newLine = {
      created_by: user.id,
      created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      balance: this.getBalance(line),
      members_balance: await this.getMembersBalance(line),
      multi_balance: storedUser.activedBookIsMultiBalance,
      ...line,
    }
    let bookCollection = collection(firebaseDb, 'books', user.activedBook, 'lines')
    let lastLine = await addDoc(bookCollection, newLine)
    this.book.unshift({ ...newLine, id: lastLine.id })
    Loading.hide()
  },
  async addBook (book) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    let newBook = {
      created_by: user.id,
      created_at: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      ...book,
    }
    let booksCollection = collection(firebaseDb, 'books')
    let bookReff = await addDoc(booksCollection, newBook)
    await this.setActiveBook({ ...newBook, id: bookReff.id }, false)
    Notify.create({
      message: i18n.global.t('book.addBookSuccess'),
      color: 'positive',
      icon: 'check_circle'
    })

  },
  async nextPage () {
    this.pagination.page++
    await this.fetchPage()
  },
  leftMenuToggle () {
    this.leftMenu = !this.leftMenu
  },
  async setActiveBook (book, fetch = true) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (user.activedBook !== book.id) {
      if (user.activedBook !== null && user.activedBook !== undefined) {
        storedUser.user.books[user.activedBook].active = false
      }
      storedUser.user.activedBook = book.id
      storedUser.user.books[book.id] = { ...book, active: true }
      await storedUser.updateUser()
      this.tab = 'records'
      this.pagination.page = 1
      this.pagination.lastPage = false
      this.book = []
      if (fetch) {
        await this.fetchPage()
      }
      if (this.leftMenu && Screen.lt.sm) {
        this.leftMenuToggle()
      }
    }
  },
  getBalance (line, balance = null) {
    balance = balance !== null ? balance : this.balance
    let newBalance = {
      balance: parseInt(balance.balance) + parseInt(line.type === 'credit' ? line.amount : line.amount * -1),
      credit: line.type === 'credit' ? parseInt(balance.credit) + parseInt(line.amount) : balance.credit,
      debit: line.type === 'debit' ? parseInt(balance.debit) + parseInt(line.amount) : balance.debit,
    }
    return newBalance
  },
  async getMembersBalance (line) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    let membersBalance = this.membersBalance
    let memberBalance = membersBalance[user.id] !== undefined ? membersBalance[user.id]?.balance : { balance: 0, credit: 0, debit: 0 }
    membersBalance[user.id] = {
      id: user.id,
      name: user.displayName,
      balance: this.getBalance(line, memberBalance)
    }
    return this.orderMembersBalance(membersBalance)
  },
  orderMembersBalance (membersBalance) {
    let membersBalanceArray = Object.values(membersBalance)
    membersBalanceArray.sort((a, b) => b.balance - a.balance)
    membersBalance = {}
    membersBalanceArray.forEach(member => {
      membersBalance[member.id] = member
    })
    return membersBalance
  },
  async deleteLine (line) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (line.created_by === user.id && line.id === this.book[0].id) {
      Dialog.create({
        title: i18n.global.t('book.deleteLine'),
        message: i18n.global.t('book.deleteLineMessage'),
        cancel: true,
        persistent: true
      }).onOk(async () => {
        Loading.show()
        let bookCollection = collection(firebaseDb, 'books', user.activedBook, 'lines')
        await deleteDoc(doc(bookCollection, line.id))
        this.book.shift()
        this.balance = this.getBalance(line)
        this.membersBalance = await this.getMembersBalance(line)
        Loading.hide()
      })
    }
  },
  async deleteBook (book) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (book.created_by === user.id) {
      Dialog.create({
        title: i18n.global.t('book.deleteBook'),
        message: i18n.global.t('book.deleteBookMessage', { bookName: book.name }),
        cancel: true,
        persistent: true
      }).onOk(async () => {
        Loading.show()
        let bookCollection = collection(firebaseDb, 'books')
        await bookCollection.doc(book.id).delete()
        delete storedUser.user.books[book.id]
        if (user.activedBook === book.id) {
          storedUser.user.activedBook = null
        }
        await storedUser.updateUser()
        Loading.hide()
      })
    }
  },
  async getBook (bookId) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    return user.books[bookId]
  },
  async editBook (book) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    console.log(book, user.id)
    if (book.created_by === user.id) {
      Loading.show()
      let bookCollection = collection(firebaseDb, 'books')
      await setDoc(doc(bookCollection, book.id), book)
      storedUser.user.books[book.id] = book
      await storedUser.updateUser()
      Loading.hide()
    }
  }

}
