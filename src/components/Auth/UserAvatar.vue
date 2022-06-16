<template>
  <q-avatar size="50px" @click="changeAvatar" class="cursor-pointer">
    <img :src="user.photoURL" v-if="user.photoURL">
    <q-icon
      v-else
      name="account_circle"
      color="white"
      size="50px"
      class="bg-primary"
    />
  </q-avatar>
</template>

<script>
import { ref } from 'vue'
import { authStore } from 'src/stores/auth'

export default {
  name: 'user-avatar',
  setup() {
    const auth = authStore()
    const user = auth.user
    const avatarInput = ref(null)
    return {
      auth,
      user,
      avatarInput,
    }
  },
  methods: {
    changeAvatar () {
      this.avatarInput = document.createElement('input')
      this.avatarInput.type = 'file'
      this.avatarInput.accept = 'image/*'
      this.avatarInput.addEventListener('change', this.uploadAvatar)
      this.avatarInput.dispatchEvent(new MouseEvent('click'))
    },
    uploadAvatar (e) {
      if (e.path && e.path[0] && e.path[0].files && e.path[0].files[0]) {
        let file = e.path[0].files[0]
        let reader = new FileReader()
        let parent = this
        reader.onloadend = (r) => {
          parent.user.photoURL = r.target.result
          parent.auth.uploadAvatar(r.target.result)
        }
        reader.readAsDataURL(file)
      }
    }
  },
}
</script>
