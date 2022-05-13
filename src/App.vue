<template>
  <router-view />
</template>

<script>
import { authStore } from 'stores/auth/'
export default {
  name: 'main-page',
  setup () {
    const auth = authStore()
    auth.handleAuthStateChange()
  }
}
</script>
