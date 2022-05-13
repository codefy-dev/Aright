<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated >
      <q-toolbar >
        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>
        <q-btn
          v-if="auth.user.uid"
          @click="auth.logout"
          class="absolute-right q-pr-sm"
          icon="logout"
          no-caps
          flat
          dense />
      </q-toolbar>
    </q-header>
    <q-page-container >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { authStore } from 'stores/auth/'

export default {
  name: 'main-layout',
  computed: {
    title () {
      if (this.$route.fullPath === '/auth') {
        return 'Inicio de sesión'
      } else return 'Saldos y movimientos'
    }
  },
  setup () {
    const auth = authStore()

    return {
      auth
    }
  }
}

</script>
