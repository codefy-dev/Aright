<template>
  <q-item clickable v-ripple class="text-primary" @click="formDialog = true">
    <q-item-section avatar>
      <q-icon name="add_circle"  />
    </q-item-section>
    <q-item-section>
      Crear Nuevo
    </q-item-section>
  </q-item>
  <q-dialog v-model="formDialog" persistent >
    <q-card>
      <q-form @submit="addBook()" >
        <q-card-section class="text-subtitle2 text-primary">
          <q-icon name="add_circle" color="primary" size="md" />
          Nueva Cuenta
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="name"
            label="Nombre"
            class="full-width"
            lazy-rules
            :rules="[ val => val && val.length > 2 || 'Toda Cuenta Necesita un nombre']"
          />
        </q-card-section>
        <q-card-section class="row items-center">
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Multi Balance</q-item-label>
              <q-item-label caption>
                Cada persona tiene su balance basado en sus aportes y retiros
              </q-item-label>
            </q-item-section>
            <q-item-section avatar top>
              <q-checkbox v-model="multi_balance" />
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Icono</q-item-label>
            </q-item-section>
          </q-item>
          <q-item-section>
            <q-btn-toggle
              v-model="icon"
              flat
              spread
              :options="[
                {icon: 'star', value: 'star'},
                {icon: 'shopping_cart', value: 'shopping_cart'},
                {icon: 'savings', value: 'savings'},
                {icon: 'account_balance', value: 'account_balance'},
                {icon: 'favorite', value: 'favorite'},
              ]"
            />
          </q-item-section>
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Crear" color="primary" type="submit" />
        </q-card-actions>
        <q-inner-loading :showing="loading" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { bookStore } from 'src/stores/book'
export default {
  name: 'add-book',
  setup() {
    const formDialog = ref(false)
    const name = ref('')
    const icon = ref('star')
    const multi_balance = ref(false)
    const book = bookStore()
    const loading = ref(false)
    return {
      formDialog,
      name,
      icon,
      multi_balance,
      book,
      loading
    }
  },
  methods: {
    async addBook () {
      if (this.name.length > 2) {
        this.loading = true
        await this.book.addBook({
          name: this.name,
          multi_balance: this.multi_balance,
          icon: this.icon
        })
        this.loading = false
        this.formDialog = false
      }
    }
  }
}
</script>
