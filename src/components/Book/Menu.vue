<template>
  <q-btn flat icon="more_vert" color="segundary">
    <q-menu auto-close anchor="bottom right" self="top right">
      <q-list class="text-segundary">
        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            {{ $t("book.edit") }}
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
  </q-btn>
</template>

<script>
import { userStore } from "stores/user/";
import { bookStore } from "src/stores/book";

export default {
  name: "book-menu",
  setup() {
    const user = userStore();
    const book = bookStore();
    return {
      user,
      book
    };
  }
};
</script>
