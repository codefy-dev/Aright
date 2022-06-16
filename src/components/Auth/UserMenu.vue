<template>
  <q-avatar class="cursor-pointer">
    <img :src="user.photoURL"/>
    <q-menu style="width: 100%;" max-width="350px">
      <div class="row no-wrap q-pa-sm" >
        <div class="column items-center">
          <q-avatar size="72px">
            <img :src="user.photoURL"/>
          </q-avatar>
          <div class="text-subtitle1 q-mt-sm q-mb-sm">{{ user.displayName }}</div>
          <UserForm />
        </div>
        <q-separator vertical inset class="q-mx-lg" />
        <div class="column">
          <div class="text-subtitle1 q-mb-md text-grey">Configuración</div>
          <q-toggle size="sm" label="Modo Dark" class="text-primary" v-model="darkMode" @update:model-value="auth.toggleDarkMode()" />
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
      <q-inner-loading :showing="user.loading" />
    </q-menu>
  </q-avatar>
</template>

<script>
import { authStore } from 'stores/auth/'
import { ref } from 'vue'
import UserForm from './UserForm.vue'

export default {
  name: 'account-settings',
  components: {
    UserForm
  },
  setup () {
    const auth = authStore()
    const user = ref(auth.user)
    const darkMode = ref(auth.darkMode)
    return {
      auth,
      user,
      darkMode
    }
  }
}
</script>
