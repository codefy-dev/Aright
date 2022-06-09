<template>
  <q-list padding v-if="user?.user.id">
    <q-item>
      <q-item-section>
        <q-item-label caption>Libros</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :active="book.active" clickable v-ripple v-for="(book, index) in user.user.books" :key="index">
      <q-item-section avatar>
        <q-icon :name="book.icon || 'book'" />
      </q-item-section>
      <q-item-section>
        {{ book.name }}
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item clickable v-ripple class="text-primary">
      <q-item-section avatar>
        <q-icon name="add_circle"  />
      </q-item-section>
      <q-item-section>
        Crear Nuevo
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { userStore  } from 'stores/user/'
export default {
  name: 'book-list',
  setup () {
    const user = userStore()
    return {
      user
    }
  }

}
</script>
