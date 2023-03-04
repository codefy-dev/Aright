<template>
  <q-drawer
    v-model="book.leftMenu"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
    v-if="user.hasBooks"
  >
    <q-scroll-area class="fit">
      <Books />
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { ref } from "vue";
import { bookStore } from "src/stores/book";
import Books from "src/components/Book/List.vue";
import { userStore } from "src/stores/user";

export default {
  name: "left-menu",
  components: {
    Books
  },
  setup() {
    const miniState = ref(true);
    const book = bookStore();
    const user = userStore();
    return {
      miniState,
      book,
      user
    };
  }
};
</script>
