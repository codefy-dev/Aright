<template>
  <q-avatar class="cursor-pointer" icon="account_circle">
    <q-menu>
      <div class="row no-wrap q-pa-sm">
        <div class="column items-center">
          <q-avatar size="72px">
            <img src="https://cdn.quasar.dev/img/avatar4.jpg">
          </q-avatar>
          <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>
          <q-btn
            flat
            label="Editar"
            icon="edit"
            size="sm"
            v-close-popup
            class="q-mt-md"
            color="primary"
          />
        </div>
        <q-separator vertical inset class="q-mx-md" />
        <div class="column">
          <div class="text-subtitle1 q-mb-md text-primary">Configuración</div>
          <q-toggle size="sm" label="Modo Dark" />
          <q-toggle size="sm" label="Bluetooth" />
          <q-separator />
          <q-btn
            label="Logout"
            icon="logout"
            size="sm"
            flat
            v-close-popup
            @click="auth.logout"
            class="q-mt-md"
            color="negative"
          />
        </div>
      </div>
    </q-menu>
  </q-avatar>
</template>

<script>
import { authStore } from 'stores/auth/'
export default {
  name: 'account-settings',
  setup () {
    const auth = authStore()
    return {
      auth
    }
  }
}
</script>
