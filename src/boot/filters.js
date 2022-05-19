import { date } from 'quasar'

export default ({ app }) => {
  app.config.globalProperties.$filters = {
    onlyDate: (val) => {
      val = date.extractDate(val, 'YYYY-MM-DD HH:mm:ss')
      return date.formatDate(val, 'DD/MM/YY')
    },
    onlyTime: (val) => {
      val = date.extractDate(val, 'YYYY-MM-DD HH:mm:ss')
      return date.formatDate(val, 'HH:mm')
    },
    fullDate: (val) => {
      val = date.extractDate(val, 'YYYY-MM-DD HH:mm:ss')
      return date.formatDate(val, 'DD/MM/YY HH:mm')
    },
    money: (value, decimals = 0) => {
      let val = (value / 1).toFixed(decimals).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    // show hour and minutes if the value is from today else show only date
    dateOrTime: (val) => {
      let today = new Date()
      val = date.extractDate(val, 'YYYY-MM-DD HH:mm:ss')
      if (date.isSameDate(val, today, 'date')) {
        return date.formatDate(val, 'HH:mm')
      }
      return date.formatDate(val, 'DD/MM/YY')
    }
  }
}
