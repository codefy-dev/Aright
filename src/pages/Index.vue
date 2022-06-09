<template>
  <q-page class="flex flex-center" >
    <Book v-if="auth.user?.uid"/>
  </q-page>
</template>

<script>
import Book from 'src/components/Book/Main.vue'
import { authStore } from 'stores/auth/'

export default {
  name: 'index-page',
  components: {
    Book
  },
  setup () {
    const auth = authStore()
    return {
      auth
    }
  }
}
</script>
