<template>
  <q-item
    clickable
    v-ripple
    class="text-primary"
    @click="storedBook.dialogShow('add')"
  >
    <q-item-section avatar>
      <q-icon name="add_circle" />
    </q-item-section>
    <q-item-section>
      {{ $t("book.newBook") }}
    </q-item-section>
  </q-item>
  <q-dialog v-model="storedBook.dialogAdd" persistent>
    <AddForm />
  </q-dialog>
</template>

<script>
import { bookStore } from "src/stores/book";
import AddForm from "./Form.vue";

export default {
  name: "add-book",
  components: {
    AddForm
  },
  setup() {
    const storedBook = bookStore();
    return {
      storedBook
    };
  }
};
</script>
