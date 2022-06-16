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
          <UserAvatar />
          {{ $t('auth.titleUserProfile')}}<br>
          <small class="text-grey"> {{ user.email }}</small>
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="user.displayName"
            :label="$t('auth.displayName')"
            class="full-width"
            lazy-rules
            :rules="[ val => val && val.length > 2 || $t('auth.nameIsRequired')]"
            autocomplete="nope"
            type="text"
          />
        </q-card-section>
        <q-separator color="primary" inset />
        <small class="text-primary q-ml-md"> {{ $t('auth.changeOfPassword') }}</small>
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="currentPassword"
            :label="$t('auth.currentPassword')"
            class="full-width"
            :type="isPwd1 ? 'password' : 'text'"
            :rules="[
              val => val.length >= 0 || $t('auth.passwordMinLength'),
            ]"
            lazy-rules
            autocomplete="new-password"
          >
          <template v-slot:append>
            <q-icon
              :name="isPwd1 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd1 = !isPwd1"
            />
          </template>
        </q-input>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="newPassword"
            :label="$t('auth.newPassword')"
            class="full-width"
            :type="isPwd2 ? 'password' : 'text'"
            :rules="[
              val => (val.length > 5 || val.length === 0) || $t('auth.passwordMinLength', { minLength: 6 }),
            ]"
            lazy-rules
            autocomplete="new-password"
          >
          <template v-slot:append>
            <q-icon
              :name="isPwd2 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd2 = !isPwd2"
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
        <q-inner-loading :showing="user.loading" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { authStore } from 'src/stores/auth'
import UserAvatar from './UserAvatar.vue'

export default {
  name: 'user-form',
  components: {
    UserAvatar,
  },
  setup() {
    const formDialog = ref(false)
    const newPassword = ref('')
    const currentPassword = ref('')
    const auth = authStore()
    const isPwd1 = ref(true)
    const isPwd2 = ref(true)
    const user = ref(auth.user)
    return {
      formDialog,
      auth,
      newPassword,
      currentPassword,
      isPwd1,
      isPwd2,
      user
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
      }else if (this.newPassword !== '' &&  this.currentPassword === '') {
        console.log('updateProfile')
        this.$q.notify({
          color: 'negative',
          text: this.$t('auth.currentPasswordRequiredToChangePassword'),
        })
        return
      }
      const user = {
        displayName: this.user.displayName,
        passwords: this.newPassword ? {
            current: this.currentPassword,
            new: this.newPassword,
          } : null,
      }
      this.auth.updateProfile(user)
      this.formDialog = false
    },
    showDialog () {
      this.newPassword = ''
      this.currentPassword = ''
      this.isPwd1 = true
      this.isPwd2 = true
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
