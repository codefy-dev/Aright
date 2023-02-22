<template>
  <Form :bookId="bookId" :summitAction="editBook" />
</template>
<script>
import Form from "./Form.vue";
import { bookStore } from "src/stores/book";

export default {
  name: "edit-book",
  props: {
    bookId: {
      type: String,
      default: null
    }
  },
  components: {
    Form
  },
  setup() {
    const storeBook = bookStore();
    const editBook = async (book) => {
      await storeBook.editBook(book);
    };

    return {
      editBook
    };
  }
};
</script>
