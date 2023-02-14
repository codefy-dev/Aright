<template>
  <q-page class="flex justify-center">
    <Main v-if="auth.user?.uid" />
  </q-page>
</template>

<script>
import Main from "src/components/Book/Main.vue";
import { authStore } from "stores/auth/";

export default {
  name: "index-page",
  components: {
    Main
  },
  setup() {
    const auth = authStore();
    return {
      auth
    };
  }
};
</script>
