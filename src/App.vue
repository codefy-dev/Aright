<template>
  <router-view />
</template>

<script>
import { authStore } from "stores/auth/";
export default {
  name: "main-page",
  setup() {
    const auth = authStore();
    console.log("auth", auth);
    auth.handleAuthStateChange();
  }
};
</script>
