<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated v-if="auth.user?.uid">
      <q-toolbar class="q-pa-sm" >
        <Header />
      </q-toolbar>
    </q-header>
    <q-page-container >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { authStore } from 'stores/auth/'
import Header from 'src/components/Book/Header.vue'

export default {
  name: 'main-layout',
  components: {
    Header
  },
  setup () {
    const auth = authStore()

    return {
      auth
    }
  }
}

</script>
