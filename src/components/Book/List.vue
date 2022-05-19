<template>
   <div >
    <q-table
      :rows="book.book"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      :pagination="{rowsPerPage: 10}"
    >
    <!-- @request="onRequest" -->
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Busqueda">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-left>
        <div class="text-small text-grey">
          Disponibles
        </div>
        <q-chip size="md" icon="attach_money">{{ formatPrice(book.balance) }}</q-chip>
      </template>
      <template v-slot:body-cell-amount="props">
        <q-td :props="props" :class="[props.row.type === 'income' ? 'text-positive' : 'text-negative']">
            {{ formatPrice(props.value,0) }}
        </q-td>
      </template>
      <template v-slot:body-cell-balance="props">
        <q-td :props="props" :class="[props.value > 0 ? 'text-positive' : 'text-negative']">
            {{ formatPrice(props.value,0) }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from 'vue'
import { bookStore } from 'stores/book/'

const columns = [
  {
    name: 'created_at',
    label: 'Fecha',
    align: 'left',
    field: row => row.created_at,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'description', align: 'left', label: 'Descripción', field: 'description', sortable: true },
  { name: 'channel', label: 'Medio de pago', field: 'channel', sortable: true, align: 'left' },
  { name: 'amount',
    label: 'Monto',
    field: row => row.amount,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'balance', label: 'Saldo', field: 'balance', sortable: true },
]

export default {
  name: 'income-outcome-list',
  setup () {
    const book = bookStore()
    const filter = ref('')
    const loading = ref(false)
    return {
      filter,
      loading,
      columns,
      book,
    }
  },
  methods: {
    formatPrice(value, decimals = 2) {
      let val = (value/1).toFixed(decimals).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    async fetchBook () {
      this.loading = true
      await this.book.fetchBook()
      this.loading = false
    },
  },
  computed: {
  },
  mounted () {
    this.fetchBook ()
  },
}
</script>

