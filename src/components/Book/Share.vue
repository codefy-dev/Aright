<template>
  <q-card>
    <q-card-section class="text-subtitle2 text-primary row items-center">
      <div class="text-h6">
        <q-icon name="ios_share" color="primary" size="md" />
        {{ $t("book.shareBook") }}
      </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-separator color="primary" inset />
    <q-card-section>
      <q-input
        filled
        v-model="shareLink"
        :label="$t('book.linkToShare')"
        :readonly="true"
        bottom-slots
      >
        <template v-slot:prepend>
          <q-icon name="link" />
        </template>
        <template v-slot:append>
          <q-btn round flat icon="content_copy" @click="linkCopy" />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <div class="text-h6 text-primary">
        <vue-qrcode
          :value="shareLink || 'shareLink is null'"
          :options="qrOptions"
          class="fit"
        ></vue-qrcode>
      </div>
    </q-card-section>
    <q-inner-loading :showing="loading" transition-duration="1000" />
  </q-card>
</template>

<script>
import { bookStore } from "stores/book/";
import { ref } from "vue";
import { copyToClipboard } from "quasar";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { colors } from "quasar";

export default {
  name: "share-book",
  setup() {
    const storedBook = bookStore();
    const shareLink = ref(null);
    const loading = ref(false);
    const { getPaletteColor } = colors;
    const qrOptions = {
      scale: 15,
      margin: 0,
      type: "svg",
      color: {
        dark: getPaletteColor("dark"),
        light: getPaletteColor("white")
      }
    };
    return {
      storedBook,
      shareLink,
      loading,
      qrOptions
    };
  },
  components: {
    VueQrcode
  },
  methods: {
    async shareBook() {
      this.loading = true;
      this.shareLink = await this.storedBook.createDynamicLink();
      this.loading = false;
      this.linkCopy();
    },
    linkCopy() {
      if (this.shareLink !== null) {
        copyToClipboard(this.shareLink).then(() => {
          this.$q.notify({
            message: this.$t("book.linkCopied"),
            color: "positive",
            icon: "done"
          });
        });
      }
    }
  },
  mounted() {
    this.shareBook();
  }
};
</script>
