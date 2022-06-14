<template>
  <q-dialog v-model="show" persistent>
    <q-card >
      <q-img src="~assets/login-header.jpg" :ratio="16/9" />
      <q-card-section>
        <div class="text-h6">Inicio de sesión</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitForm" autocomplete="off">
          <q-input
            v-model="formData.email"
            class="q-mb-md"
            outlined
            type="email"
            label="Email"
            :rules="[val => !!val || 'Email Requerido', isValidEmail || 'Email Invalido']"
            lazy-rules
            />
          <q-input
            v-model="formData.password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña"
            ref="password"
            :rules="[val => !!val || 'Contraseña Requerida']"
            lazy-rules
            @keyup.enter="submitForm"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="row">
            <q-space />
            <q-btn
              color="primary"
              type="submit"
              label="Login" />
          </div>
        </q-form>
      </q-card-section>
      <q-inner-loading :showing="auth.user.loading" transition-duration="1000"></q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
  import { authStore } from 'stores/auth/'
  import { ref } from 'vue'
	export default {
    name: 'login-form',
    setup () {
      const auth = authStore()
      const formData = ref({
            email: '',
            password: ''
          })
      const isPwd = ref(true)
      return {
        formData,
        auth,
        isPwd
      }
    },
		methods: {
			submitForm() {
        this.auth.login(this.formData)
			},
      isValidEmail (val) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'Email Invalido';
      }
		},
    computed: {
      show() {
        return !this.auth.user?.uid
      }
    }
	}
</script>
