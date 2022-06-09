<template>
  <q-drawer
    v-model="book.leftMenu"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
  >
    <q-scroll-area class="fit">
      <BookList />
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { ref } from 'vue'
import { bookStore } from 'src/stores/book'
import BookList from 'components/Book/List.vue'

export default {
  name: 'left-menu',
  components: {
    BookList
},
  setup () {
    const miniState = ref(true)
    const book = bookStore()
    return {
      miniState,
      book
    }
  }
}
</script>
