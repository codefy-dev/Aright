<template>
  <q-page class="flex flex-center" >
    <div class="q-pa-md col-6" v-if="auth?.user.uid">
      <Actions />
      <List />
    </div>
  </q-page>
</template>

<script>
import List from 'components/Book/List.vue'
import Actions from 'components/Book/Actions.vue'
import { authStore } from 'stores/auth/'

export default {
  name: 'index-page',
  components: {
    List,
    Actions
  },
  setup () {
    const auth = authStore()
    return {
      auth
    }
  }
}
</script>
