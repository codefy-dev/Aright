<template>
  <div class="q-gutter-y-sm q-mt-none" style="width: 100%; max-width: 900px">
    <q-card square>
      <q-toolbar class="">
        <q-tabs
          v-model="book.tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          inline-label
        >
          <q-tab
            name="records"
            :label="$t('book.records')"
            icon="receipt_long"
          />
          <q-tab
            name="balances"
            :label="$t('book.balances')"
            icon="bar_chart"
            v-if="user.activedBookIsMultiBalance"
          />
        </q-tabs>
        <q-space />
        <Menu />
      </q-toolbar>
      <q-separator />
      <q-tab-panels v-model="book.tab" animated swipeable infinite keep-alive>
        <q-tab-panel name="records">
          <records />
        </q-tab-panel>
        <q-tab-panel name="balances" v-if="user.activedBookIsMultiBalance">
          <Balance />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import Records from "./Records.vue";
import Balance from "./Balance.vue";
import Menu from "./Menu.vue";
import { userStore } from "stores/user/";
import { bookStore } from "src/stores/book";

export default {
  name: "book-main",
  components: {
    Records,
    Balance,
    Menu
  },
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
