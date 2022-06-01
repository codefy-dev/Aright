<template>
   <q-input
    v-model="filter"
    placeholder="Busqueda..."
    standout
    dark

    style="width:100%"
    bg-color="primary"
    class="q-ma-none"
    >
    <template v-slot:prepend>
      <q-icon name="menu" class="cursor-pointer"/>
    </template>
    <template v-slot:append>
      <q-avatar  @click="auth.logout" class="cursor-pointer" icon="account_circle"/>
    </template>
  </q-input>
</template>

<script>
import { authStore } from 'stores/auth/'
import { ref } from 'vue'
export default {
  name: 'search-box',
  setup () {
    const auth = authStore()
    const filter = ref('')
    return {
      filter,
      auth
    }
  },

}
</script>
