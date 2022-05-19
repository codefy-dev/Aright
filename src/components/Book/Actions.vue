<template>
  <div >
    <q-btn-group spread>
      <q-btn color="positive" label="Entrada" icon="savings" @click="openAddDialog()" />
      <q-btn color="negative" label="Salida" icon="shopping_cart" @click="openAddDialog('outcome')"/>
    </q-btn-group>
    <q-dialog v-model="addDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row ">
          <div class="text-h6">
            <q-avatar :icon="actionIcon()" :color="acctionColor()" text-color="white" /> Nuevo Registro de <strong :class="['text-' + acctionColor()]">{{ actionTitle() }}</strong>.
          </div>
        </q-card-section>
          <q-card-section vertical >
            <q-form @submit="add"  class="q-gutter-xs">
                  <q-input outlined v-model="newLine.description" label="Descripción" required  />
                  <q-input outlined v-model.number="newLine.amount" label="Monto" required  type="number" />
                  <q-select outlined v-model="newLine.channel" :options="channels" label="Tipo de Transacción" required />
              <q-card-actions align="right" >
                <q-btn color="positive" label="Guardar" icon="save"  type="submit" :loading="loading" />
              </q-card-actions>
            </q-form>
          </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { bookStore } from 'stores/book/'
// para testing no borrar
const bookLocal = [
    {
      "type": "outcome",
      "description": "Compra Varia",
      "channel": "transfer",
      "amount": 10000
    },
    {
      "type": "income",
      "description": "Pago Cuota",
      "channel": "transfer",
      "amount": 150000
    },
    {
      "type": "outcome",
      "description": "Compra Comida",
      "channel": "transfer",
      "amount": 25000
    },
    {
      "type": "outcome",
      "description": "Compra Frutas",
      "channel": "transfer",
      "amount": 15000
    },
    {
      "type": "outcome",
      "description": "Compra Licores",
      "channel": "transfer",
      "amount": 250000
    },
    {
      "type": "income",
      "description": "Capital",
      "channel": "transfer",
      "amount": 1000000
    },
    {
      "type": "outcome",
      "description": "Compra Ropa",
      "channel": "transfer",
      "amount": 25000
    },
   {
      "type": "outcome",
      "description": "Cine",
      "channel": "transfer",
      "amount": 15000
    },
    {
      "type": "outcome",
      "description": "Gasolina",
      "channel": "transfer",
      "amount": 250000
    },
    {
      "type": "income",
      "description": "Cobro de factura",
      "channel": "transfer",
      "amount": 1000000
    },
    {
      "type": "outcome",
      "description": "Alquiler",
      "channel": "transfer",
      "amount": 25000
    },
    {
      "type": "outcome",
      "description": "Luz y Agua",
      "channel": "transfer",
      "amount": 15000
    },
    {
      "type": "outcome",
      "description": "Teatro",
      "channel": "transfer",
      "amount": 250000
    },
    {
      "type": "income",
      "description": "Sueldo",
      "channel": "transfer",
      "amount": 1000000,
    },
    {
      "type": "outcome",
      "description": "Cena",
      "channel": "transfer",
      "amount": 25000
    },
    {
      "type": "outcome",
      "description": "Prestamo",
      "channel": "transfer",
      "amount": 15000
    }
]

const defaultLine = {
      description: '',
      amount: '',
      type: 'income',
      channel: { label: 'Transferencia', value: 'transfer' }
    }
const defaultChannels = [
  { label: 'Transferencia', value: 'transfer' },
  { label: 'Efectivo', value: 'cash' },
  { label: 'Tarjeta de Crédito', value: 'credit_card' },
  { label: 'Tarjeta de Débito', value: 'debit_card' },
  { label: 'Cheque', value: 'check' },
  { label: 'Otro', value: 'other' }
]

export default {
  name: 'income-outcome-btns',
  setup () {
    const book = bookStore()
    const addDialog = ref(false)
    const newLine = ref(defaultLine)
    const channels = defaultChannels
    const loading = ref(false)
    return {
      addDialog,
      newLine,
      channels,
      book,
      loading
    }
  },
  methods: {
    openAddDialog (type = 'income') {
      this.newLine = defaultLine
      this.newLine.type = type
      this.addDialog = true
    },
    acctionColor () {
      return 'income' === this.newLine.type ? 'positive' : 'negative'
    },
    actionIcon () {
      return 'income' === this.newLine.type ? 'savings' : 'shopping_cart'
    },
    actionTitle () {
      return 'income' === this.newLine.type ? 'Entrada' : 'Salida'
    },
    async add () {
      this.newLine.channel = this.newLine.channel?.value || this.newLine.channel
      this.loading = true
      await this.book.addLine(this.newLine)
      this.loading = false
      this.addDialog = false
      this.newLine = defaultLine
    }
  },
  mounted () {
    // for (let i = 1; i < bookLocal.length; i++ ) {
    //     setTimeout(()=>{
    //       this.newLine = bookLocal[i]
    //       this.add()
    //   },i * 2000);
    // }
  }
}
</script>

