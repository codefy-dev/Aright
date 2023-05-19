<template>
  <q-layout view="hHh Lpr lff">
    <Header v-if="auth.user?.uid" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { authStore } from "stores/auth/";
import Header from "./Book/Header.vue";

export default {
  name: "main-layout",
  components: {
    Header
  },
  setup() {
    const auth = authStore();
    return {
      auth
    };
  }
};
</script>
