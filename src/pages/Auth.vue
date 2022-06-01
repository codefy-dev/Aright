<template>
  <q-page class="flex flex-center row">
    <div class="q-pa-md col-12">
      <Login />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Login from 'components/Auth/Login.vue'

export default defineComponent({
  name: 'auth-page',
  components: {
    Login
  }
})
</script>
