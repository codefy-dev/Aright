import { Screen } from 'quasar'
import { i18n } from '../../boot/i18n';

export default {
  balance (state) {
    return state?.book[0]?.balance ?? {
      balance: 0,
      credit: 0,
      debit: 0,
    }
  },
  availableGateways () {
    return [
      {
        label: i18n.global.t('book.gateways.transfer'),
        value: 'transfer',
        icon: 'devices'
      },
      {
        label: i18n.global.t('book.gateways.cash'),
        value: 'cash',
        icon: 'payments'
      },
      {
        label: i18n.global.t('book.gateways.creditCard'),
        value: 'credit_card',
        icon: 'credit_card'
      },
      {
        label: i18n.global.t('book.gateways.debitCard'),
        value: 'debit_card',
        icon: 'credit_card'
      },
      {
        label: i18n.global.t('book.gateways.other'),
        value: 'other',
        icon: 'credit_card'
      },
    ]
  },
  linesPerPage (state) {
    let minPerPage = state.pagination.minPerPage
    let posibleLines = Math.floor(Screen.height / 50)
    return posibleLines < minPerPage ? minPerPage : posibleLines
  },
  empty (state) {
    return state.book.length === 0
  },
  membersBalance (state) {
    return state?.book[0]?.members_balance ?? {}
  }
}
