<template>
  <q-list padding v-if="user?.user.id">
    <q-item>
      <q-item-section>
        <q-item-label caption>Libros</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :active="book.active" clickable v-ripple v-for="(book, index) in user.user.books" :key="index" @click="setAndFetchActiveBook(index)">
      <q-item-section avatar>
        <q-icon :name="book.icon || 'book'" />
      </q-item-section>
      <q-item-section>
        {{ book.name }}
      </q-item-section>
    </q-item>
    <q-separator />
    <Add />
  </q-list>
</template>

<script>
import { userStore  } from 'stores/user/'
import { bookStore } from 'stores/book/'
import Add from './Add.vue'
export default {
  name: 'book-list',
  components: {
    Add
  },
  setup () {
    const user = userStore()
    const book = bookStore()
    return {
      user,
      book
    }
  },
  methods: {
    setAndFetchActiveBook (id) {
      this.book.setAndFetchActiveBook(id)
    }
  }

}
</script>
