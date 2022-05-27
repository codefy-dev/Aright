export default {
  balance (state) {
    return state?.book[0]?.balance ?? 0
  },
  availableChannels () {
    return [
      {
        label: 'Transferencia',
        value: 'transfer',
        icon: 'devices'
      },
      {
        label: 'Efectivo',
        value: 'cash',
        icon: 'payments'
      },
      {
        label: 'Tarjeta de Crédito',
        value: 'credit_card',
        icon: 'credit_card'
      },
      {
        label: 'Tarjeta de Débito',
        value: 'debit_card',
        icon: 'credit_card'
      },
      {
        label: 'Cheque',
        value: 'check',
        icon: 'subtitles'
      },
      {
        label: 'Otro',
        value: 'other',
        icon: 'credit_card'
      },
    ]
  }
}
