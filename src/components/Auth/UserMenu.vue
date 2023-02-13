<template>
  <q-avatar class="cursor-pointer" size="100px">
    <UserAvatar :clickable="false" />
    <q-menu style="width: 100%" max-width="400px" :offset="[10, -20]">
      <div class="row no-wrap q-pa-sm">
        <div class="column items-center">
          <UserAvatar />
          <div class="text-subtitle1 q-mt-sm q-mb-sm">
            {{ user.displayName }}
          </div>
          <UserForm />
        </div>
        <q-separator vertical inset class="q-mx-lg" />
        <div class="column">
          <div class="text-subtitle1 q-mb-md text-grey">Configuración</div>
          <q-toggle
            size="sm"
            label="Modo Dark"
            class="text-primary"
            v-model="darkMode"
            @update:model-value="auth.toggleDarkMode()"
          />
          <q-separator />
          <q-btn
            label="Logout"
            icon="logout"
            size="sm"
            flat
            v-close-popup
            @click="auth.logout"
            class="q-mt-sm full-width"
            color="negative"
          />
        </div>
      </div>
      <q-inner-loading :showing="auth.user.loading" />
    </q-menu>
  </q-avatar>
</template>

<script>
import { userStore } from "stores/user";
import { authStore } from "src/stores/auth";
import { ref } from "vue";
import UserForm from "./UserForm.vue";
import UserAvatar from "./UserAvatar.vue";

export default {
  name: "account-settings",
  components: {
    UserForm,
    UserAvatar
  },
  setup() {
    const auth = authStore();
    const storedUser = userStore();
    const user = ref({});
    const darkMode = ref(auth.darkMode);
    return {
      auth,
      user,
      darkMode,
      storedUser
    };
  },
  async mounted() {
    this.user = await this.storedUser.userInfo;
  }
};
</script>
