<template>
  <q-btn flat icon="more_vert" color="segundary">
    <q-menu auto-close anchor="bottom right" self="top right">
      <q-list class="text-segundary">
        <q-item clickable v-if="user.isOwner" @click="storedBook.dialogShow">
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            {{ $t("edit") }}
          </q-item-section>
        </q-item>
        <q-item clickable @click="dialogShare = true">
          <q-item-section avatar>
            <q-icon name="ios_share" />
          </q-item-section>
          <q-item-section>
            {{ $t("book.share") }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-dialog v-model="storedBook.dialogEdit" persistent>
      <EditForm :bookId="user.activeBook.id" />
    </q-dialog>
    <q-dialog v-model="dialogShare">
      <ShareDialog />
    </q-dialog>
  </q-btn>
</template>

<script>
import { userStore } from "stores/user/";
import { bookStore } from "stores/book/";
import EditForm from "./Form.vue";
import ShareDialog from "./Share.vue";
import { ref } from "vue";

export default {
  name: "book-menu",
  components: {
    EditForm,
    ShareDialog
  },
  setup() {
    const user = userStore();
    const storedBook = bookStore();
    const dialogShare = ref(false);
    return {
      user,
      storedBook,
      dialogShare
    };
  }
};
</script>
