<template>
  <q-dialog v-model="show" persistent>
    <q-card>
      <q-img src="~assets/login-header.jpg" :ratio="16 / 9">
        <div class="absolute-bottom text-right">
          <q-img src="~assets/logo.svg" style="max-width: 200px" />
        </div>
      </q-img>
      <q-card-section>
        <div class="text-h6">{{ $t("auth.loginTitle") }}</div>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="primary"
          class="full-width"
          :label="$t('auth.emailLinkLogin')"
          icon="mail"
          align="between"
          @click="emailLinkPrompt = true"
        />
        <q-btn
          color="white"
          class="full-width q-mt-sm"
          :label="$t('auth.googleLogin')"
          icon="fa-brands fa-google"
          text-color="black"
          align="between"
        />
        <q-btn
          color="grey-9"
          class="full-width q-mt-sm"
          :label="$t('auth.appleLogin')"
          icon="fa-brands fa-apple"
          align="between"
        />
        <q-separator class="q-mb-md" />
        <q-form @submit="submitForm" autocomplete="off">
          <q-input
            v-model="formData.email"
            class="q-mb-md"
            outlined
            type="email"
            :label="$t('auth.email')"
            :rules="[
              (val) => !!val || $t('auth.emailIsRequired'),
              isValidEmail
            ]"
            lazy-rules
          />
          <q-input
            v-model="formData.password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            :label="$t('auth.password')"
            ref="password"
            :rules="[(val) => !!val || $t('auth.passwordIsRequired')]"
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
            <q-btn color="primary" type="submit" :label="$t('auth.login')" />
          </div>
        </q-form>
      </q-card-section>
      <q-dialog v-model="emailLinkPrompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="text-subtitle2 text-primary row items-center">
            <div class="text-h6">
              <q-icon name="mail" color="primary" size="md" />
              {{ $t("auth.emailLinkLoginMessage") }}
            </div>
            <q-space />
            <q-btn
              icon="close"
              flat
              round
              dense
              @click="emailLinkPrompt = false"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="formData.email"
              autofocus
              @keyup.enter="prompt = false"
              :rules="[
                (val) => !!val || $t('auth.emailIsRequired'),
                isValidEmail
              ]"
              lazy-rules
              outlined
              :label="$t('auth.email')"
              ref="emailLinkInputRef"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('send')" @click="sendEmailLink()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-inner-loading
        :showing="auth.user.loading"
        transition-duration="1000"
      ></q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
import { authStore } from "stores/auth/";
import { ref } from "vue";
export default {
  name: "login-form",
  setup() {
    const auth = authStore();
    const formData = ref({
      email: "miha@aright.app",
      password: "",
      type: "emailPassword"
    });
    const isPwd = ref(true);
    const emailLinkPrompt = ref(false);
    const emailLinkInputRef = ref(null);
    return {
      formData,
      auth,
      isPwd,
      emailLinkPrompt,
      emailLinkInputRef
    };
  },
  methods: {
    submitForm() {
      this.auth.login(this.formData);
    },
    isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || this.$t("auth.emailIsInvalid");
    },
    sendEmailLink() {
      this.emailLinkInputRef.validate();
      if (this.emailLinkInputRef.hasError) {
        return;
      }
      this.formData.type = "link";
      this.auth.login(this.formData);
    }
  },
  computed: {
    show() {
      return !this.auth.user?.uid;
    }
  }
};
</script>
