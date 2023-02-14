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
        <q-tab name="transactions" label="Transactions" />
        <q-tab name="balances" label="Balances" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated swipeable infinite keep-alive>
        <q-tab-panel name="transactions">
          <Transactions />
        </q-tab-panel>
        <q-tab-panel name="balances">
          <div class="text-h6">Balances</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-card v-else square>
      <Transactions />
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import Transactions from "src/components/Book/Transactions.vue";
import { userStore } from "stores/user/";

export default {
  name: "BookMain",
  components: {
    Transactions
  },
  setup() {
    const tab = ref("transactions");
    const user = userStore();
    return {
      tab,
      user
    };
  }
};
</script>
