<template>
  <div class="q-gutter-y-sm q-mt-none" style="width: 100%; max-width: 900px">
    <q-card v-if="user.activedBookIsMultiBalance" square>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="records" :label="$t('book.records')" />
        <q-tab name="balances" :label="$t('book.balances')" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated swipeable infinite keep-alive>
        <q-tab-panel name="records">
          <records />
        </q-tab-panel>
        <q-tab-panel name="balances">
          <Balance />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-card v-else square>
      <Records />
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import Records from "src/components/Book/Records.vue";
import Balance from "./Balance.vue";
import { userStore } from "stores/user/";

export default {
  name: "BookMain",
  components: {
    Records,
    Balance
  },
  setup() {
    const tab = ref("records");
    const user = userStore();
    return {
      tab,
      user
    };
  }
};
</script>
