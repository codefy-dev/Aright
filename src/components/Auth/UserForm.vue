<template>
  <q-btn
    flat
    :label="$t('edit')"
    icon="edit"
    size="sm"
    class="q-mt-sm full-width"
    color="primary"
    @click="showDialog()"
  />
  <q-dialog v-model="formDialog" persistent >
    <q-card>
      <q-form @submit="updateProfile()" autocomplete="off">
        <q-card-section class="text-subtitle2 text-primary">
          <q-avatar size="50px">
            <img :src="photoURL" v-if="photoURL">
            <q-icon
              v-else
              name="account_circle"
              color="white"
              size="50px"
              class="bg-primary"
            />
          </q-avatar>
          {{ $t('auth.titleUserProfile')}}<br>
          <small class="text-grey"> {{ user.email }}</small>
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="displayName"
            :label="$t('auth.displayName')"
            class="full-width"
            lazy-rules
            :rules="[ val => val && val.length > 2 || $t('auth.nameIsRequired')]"
            autocomplete="nope"
            type="text"
          />
        </q-card-section>
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="newPassword"
            :label="$t('auth.newPassword')"
            class="full-width"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              val => (val.length > 5 || val.length === 0) || $t('auth.passwordMinLength', { minLength: 6 }),
            ]"
            lazy-rules
            autocomplete="new-password"
          >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
          <template v-slot:hint v-if="newPassword !== ''">
            <div class="row q-gutter-sm">
              <q-linear-progress
                v-for="score in [1,2,3,4]"
                :key="score"
                class="col"
                :color="passwordStrength?.color"
                :value="passwordStrength?.values[score]"
              />
            </div>
            <div class="row">
              {{ passwordStrength.text }}
            </div>
          </template>
        </q-input>
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="negative" v-close-popup />
          <q-btn :label="$t('save')" color="primary" type="submit" />
        </q-card-actions>
        <q-inner-loading :showing="loading" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { authStore } from 'src/stores/auth'
export default {
  name: 'user-form',
  setup() {
    const formDialog = ref(false)
    const displayName = ref('')
    const photoURL = ref('')
    const newPassword = ref('')
    const loading = ref(false)
    const auth = authStore()
    const isPwd = ref(true)
    const user = auth.user
    return {
      formDialog,
      displayName,
      photoURL,
      loading,
      auth,
      newPassword,
      isPwd,
      user,
    }
  },
  methods: {
    updateProfile () {
      if (this.newPassword !== '' && this.passwordStrength.score < 2) {
        this.$q.notify({
          color: 'negative',
          text: this.$t('auth.passwordWeak'),
        })
        return
      }
      const user = {
        displayName: this.displayName,
        photoURL: this.photoURL,
        password: this.newPassword
      }
      this.auth.updateProfile(user)
      this.formDialog = false
    },
    showDialog () {
      this.displayName = this.user.displayName
      this.photoURL = this.user.photoURL
      this.newPassword = ''
      this.isPwd = true
      this.formDialog = true
    },
  },
  computed: {
    passwordStrength () {
      return this.auth.passwordStrength(this.newPassword)
    }
  }
}
</script>
