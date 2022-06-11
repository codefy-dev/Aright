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
            label="Email" />
          <q-input
            v-model="formData.password"
            class="q-mb-md"
            outlined
            type="password"
            label="Password" />
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
      return {
        formData,
        auth
      }
    },
		methods: {
			submitForm() {
        this.auth.login(this.formData)
			}
		},
    computed: {
      show() {
        return !this.auth.user?.uid
      }
    }
	}
</script>
