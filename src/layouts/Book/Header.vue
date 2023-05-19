<template>
  <q-header elevated>
    <q-toolbar class="q-pa-sm">
      <q-input
        v-model="filter"
        placeholder="Busqueda..."
        standout
        dark
        style="width: 100%"
        bg-color="primary"
        class="q-ma-none"
      >
        <template v-slot:prepend>
          <q-icon
            name="menu"
            class="cursor-pointer"
            @click="book.leftMenuToggle()"
          />
        </template>
        <template v-slot:append>
          <UserMenu />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
  <LeftMenu />
</template>
<script>
import { bookStore } from "src/stores/book";
import { ref } from "vue";
import LeftMenu from "layouts/Book/LeftMenu.vue";
import UserMenu from "components/Auth/UserMenu.vue";

export default {
  name: "search-box",
  components: {
    LeftMenu,
    UserMenu
  },
  setup() {
    const book = bookStore();
    const filter = ref("");
    return {
      filter,
      book
    };
  }
};
</script>
