<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="add" direction="left">
        <q-fab-action color="positive" @click="openAddDialog()" icon="savings" />
        <q-fab-action color="secondary" @click="mockLine()" icon="auto_fix_high" />
        <q-fab-action color="negative" @click="openAddDialog('outcome')" icon="shopping_cart" />
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="addDialog">
      <q-card style="width: 100%; max-width: 95vw;">
        <q-card-section class="row ">
          <div class="text-h6">
            <q-avatar :icon="actionIcon()" :color="acctionColor()" text-color="white" /> Nuevo Registro de <strong :class="['text-' + acctionColor()]">{{ actionTitle() }}</strong>.
          </div>
        </q-card-section>
        <q-card-section vertical >
          <q-form @submit="add"  class="q-gutter-xs">
            <q-input outlined v-model="newLine.description" label="Descripción" required  />
            <q-input outlined v-model.number="newLine.amount" label="Monto" required  type="number" />
            <q-select outlined v-model="newLine.channel" :options="book.availableChannels" label="Tipo de Transacción" required />
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

const defaultLine = {
      description: '',
      amount: '',
      type: 'income',
      channel: { label: 'Transferencia', value: 'transfer' }
    }

export default {
  name: 'income-outcome-btns',
  setup () {
    const book = bookStore()
    const addDialog = ref(false)
    const newLine = ref(defaultLine)
    const loading = ref(false)
    return {
      addDialog,
      newLine,
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
    },
    async mockLine () {
      let mockDescriptions = [
          'Compra Varia','Pago Cuota','Compra Comida','Compra Frutas','Compra Licores','Capital','Compra Ropa',
          'Cine','Gasolina','Cobro de factura','Alquiler','Luz y Agua','Sueldo','Cena','Prestamo'
        ]
      this.newLine = {
        type: Math.random() < 0.5 ? 'income' : 'outcome',
        description: mockDescriptions[Math.floor(Math.random()*mockDescriptions.length)],
        amount: Math.floor(Math.random() * (1000000 - 10000 + 1) + 10000),
        channel: this.book.availableChannels[Math.floor(Math.random()*this.book.availableChannels.length)]
      }
      await this.add()
    }
  },
  mounted () {
  }
}
</script>

