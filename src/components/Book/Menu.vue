<template>
  <q-btn flat icon="more_vert" color="segundary">
    <q-menu auto-close anchor="bottom right" self="top right">
      <q-list class="text-segundary">
        <q-item clickable v-if="user.isOwner" @click="showEditDialog = true">
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            {{ $t("edit") }}
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="ios_share" />
          </q-item-section>
          <q-item-section>
            {{ $t("book.share") }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-dialog v-model="showEditDialog" persistent>
      <Edit :bookId="user.activeBook?.id ?? null" />
    </q-dialog>
  </q-btn>
</template>

<script>
import { userStore } from "stores/user/";
import Edit from "./Edit.vue";
import { ref } from "vue";

export default {
  name: "book-menu",
  components: {
    Edit
  },
  setup() {
    const user = userStore();
    const showEditDialog = ref(false);
    return {
      user,
      showEditDialog
    };
  }
};
</script>
