<template>
  <q-card>
    <q-card-section>
      <q-input
        filled
        v-model="shareLink"
        :label="$t('book.linkToShare')"
        :readonly="true"
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Close" color="primary" v-close-popup />
    </q-card-actions>
    <q-inner-loading :showing="loading" transition-duration="1000" />
  </q-card>
</template>

<script>
import { bookStore } from "stores/book/";
import { ref } from "vue";

export default {
  name: "share-book",
  setup() {
    const storedBook = bookStore();
    const shareLink = ref(null);
    return {
      storedBook,
      shareLink
    };
  },
  methods: {
    async shareBook() {
      this.loading = true;
      this.shareLink = await this.storedBook.createDynamicLink();
      this.loading = false;
    }
  },
  mounted() {
    this.shareBook();
  }
};
</script>
