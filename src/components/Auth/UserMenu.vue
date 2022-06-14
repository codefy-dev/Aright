<template>
  <q-avatar class="cursor-pointer" icon="account_circle">
    <q-menu style="width: 100%;" max-width="350px">
      <div class="row no-wrap q-pa-sm" >
        <div class="column items-center">
          <q-avatar size="72px">
            <img src="https://cdn.quasar.dev/img/avatar4.jpg">
          </q-avatar>
          <div class="text-subtitle1 q-mt-sm q-mb-sm">Miharbi Hernandez</div>
          <UserForm />
        </div>
        <q-separator vertical inset class="q-mx-lg" />
        <div class="column">
          <div class="text-subtitle1 q-mb-md text-grey">Configuración</div>
          <q-toggle size="sm" label="Modo Dark" class="text-primary" />
          <q-toggle size="sm" label="Bluetooth" class="text-primary" />
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
    </q-menu>
  </q-avatar>
</template>

<script>
import { authStore } from 'stores/auth/'
import UserForm from './UserForm.vue'
export default {
  name: 'account-settings',
  components: {
    UserForm
  },
  setup () {
    const auth = authStore()
    return {
      auth
    }
  }
}
</script>
