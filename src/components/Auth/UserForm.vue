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
  <q-dialog v-model="formDialog" persistent>
    <q-card>
      <q-form @submit="updateProfile()" autocomplete="off">
        <q-card-section class="text-subtitle2 text-primary">
          <UserAvatar />
          {{ $t("auth.titleUserProfile") }}<br />
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
            :rules="[
              (val) => (val && val.length > 2) || $t('auth.nameIsRequired')
            ]"
            autocomplete="nope"
            type="text"
          />
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="negative" v-close-popup />
          <q-btn :label="$t('save')" color="primary" type="submit" />
        </q-card-actions>
        <q-inner-loading :showing="auth.user.loading" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { authStore } from "src/stores/auth";
import { userStore } from "stores/user";
import UserAvatar from "./UserAvatar.vue";

export default {
  name: "user-form",
  components: {
    UserAvatar
  },
  setup() {
    const formDialog = ref(false);
    const auth = authStore();
    const user = ref(auth.user);
    const storedUser = userStore();
    return {
      formDialog,
      auth,
      user,
      storedUser
    };
  },
  methods: {
    async updateProfile() {
      const user = {
        displayName: this.user.displayName
      };
      this.auth.updateProfile(user);
      let userInfo = await this.storedUser.userInfo;
      if (userInfo.displayName !== user.displayName) {
        await this.storedUser.updateUser();
      }
      this.formDialog = false;
    },
    showDialog() {
      this.formDialog = true;
    }
  }
};
</script>
