<template>
  <q-avatar :size="size" @click="changeAvatar" class="cursor-pointer">
    <img :src="user.photoURL" v-if="user.photoURL" />
    <q-icon v-else name="account_circle" color="white" class="bg-primary" />
  </q-avatar>
</template>

<script>
import { authStore } from "src/stores/auth";

export default {
  name: "user-avatar",
  setup() {
    const auth = authStore();
    const user = auth.user;
    return {
      auth,
      user
    };
  },
  methods: {
    changeAvatar() {
      if (!this.clickable) return;
      let avatarInput = document.createElement("input");
      avatarInput.setAttribute("type", "file");
      avatarInput.setAttribute("accept", "image/*");
      avatarInput.addEventListener("change", this.uploadAvatar, false);
      avatarInput.dispatchEvent(new MouseEvent("click"));
    },
    uploadAvatar(e) {
      if (e.target && e.target.files && e.target.files[0]) {
        let file = e.target.files[0];
        let reader = new FileReader();
        let parent = this;
        reader.onloadend = (r) => {
          parent.user.photoURL = r.target.result;
          parent.auth.uploadAvatar(r.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  },
  props: {
    size: {
      type: String,
      default: "50px"
    },
    clickable: {
      type: Boolean,
      default: true
    }
  }
};
</script>
