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
                <q-btn color="positive" label="Guardar" icon="save"  type="submit" />
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
      "description": "Compra Cebada",
      "channel": "transfer",
      "amount": 25000
    },
    {
      "type": "outcome",
      "description": "Compra Lupulo",
      "channel": "transfer",
      "amount": 15000
    },
    {
      "type": "outcome",
      "description": "Compra Fermentador",
      "channel": "transfer",
      "amount": 250000
    },
    {
      "type": "income",
      "description": "Capital Inicial",
      "channel": "transfer",
      "amount": 1000000
    },
    {
      "type": "outcome",
      "description": "Compra Cebada",
      "channel": "transfer",
      "amount": 25000
    },
   {
      "type": "outcome",
      "description": "Compra Lupulo",
      "channel": "transfer",
      "amount": 15000
    },
    {
      "type": "outcome",
      "description": "Compra Fermentador",
      "channel": "transfer",
      "amount": 250000
    },
    {
      "type": "income",
      "description": "Capital Inicial",
      "channel": "transfer",
      "amount": 1000000
    },
    {
      "type": "outcome",
      "description": "Compra Cebada",
      "channel": "transfer",
      "amount": 25000
    },
    {
      "type": "outcome",
      "description": "Compra Lupulo",
      "channel": "transfer",
      "amount": 15000
    },
    {
      "type": "outcome",
      "description": "Compra Fermentador",
      "channel": "transfer",
      "amount": 250000
    },
    {
      "type": "income",
      "description": "Capital",
      "channel": "transfer",
      "amount": 1000000,
    },
    {
      "type": "outcome",
      "description": "Compra Cebada",
      "channel": "transfer",
      "amount": 25000
    },
    {
      "type": "outcome",
      "description": "Compra Lupulo",
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
    return {
      addDialog,
      newLine,
      channels,
      book,
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
    add () {
      this.newLine.channel = this.newLine.channel.value
      this.book.addLine(this.newLine).then(() => {
        this.addDialog = false
        this.newLine = defaultLine
      })
    }
  }
}
</script>

