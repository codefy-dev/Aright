<template>
  <q-page class="flex flex-center" >
    <List v-if="auth.user?.uid"/>
  </q-page>
</template>

<script>
import List from 'components/Book/List.vue'
import { authStore } from 'stores/auth/'

export default {
  name: 'index-page',
  components: {
    List
  },
  setup () {
    const auth = authStore()
    return {
      auth
    }
  }
}
</script>
