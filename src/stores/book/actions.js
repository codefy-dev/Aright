import { firebaseDb } from '../../boot/firebase'
import { Loading, date, Screen } from 'quasar'
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
        this.pagination.lastPage = lines.empty && this.pagination.page !== 1
      }
    }
  },
  async addLine (line) {
    Loading.show()
    const storedUser = userStore()
    let user = await storedUser.userInfo
    if (!user.activedBook) {
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
      members: [user.id],
      ...book,
    }
    let booksCollection = collection(firebaseDb, 'books')
    let bookReff = await addDoc(booksCollection, newBook)
    this.setActiveBook({ ...book, id: bookReff.id }, false)
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
      storedUser.user.books[user.activedBook].active = false
      storedUser.user.activedBook = book.id
      storedUser.user.books[book.id] = { ...book, active: true }
      await storedUser.updateUser()
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
    return parseInt(balance) + parseInt(line.type === 'inflow' ? line.amount : line.amount * -1)
  },
  async getMembersBalance (line) {
    const storedUser = userStore()
    let user = await storedUser.userInfo
    let membersBalance = this.membersBalance
    let memberBalance = membersBalance[user.id] !== undefined ? membersBalance[user.id]?.balance : 0
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
  }

}
