<template>
  <q-page class="flex flex-center">
    <Login />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Login from "src/components/Auth/Login.vue";

export default defineComponent({
  name: "auth-page",
  components: {
    Login
  }
});
</script>
