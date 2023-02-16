<template>
  <div class="q-pa-md" style="width: 100%">
    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        v-for="(memberBalance, index) in balance"
        :key="index"
      >
        <q-item-section>
          <q-item-label caption>{{ memberBalance.name }}</q-item-label>
          <q-item-label>
            {{ $filters.money(memberBalance.balance) }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-linear-progress
            size="25px"
            :value="linePercentage(memberBalance).value"
            :color="lineColor(memberBalance)"
            class="q-mt-sm"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="linePercentage(memberBalance).label"
              />
            </div>
          </q-linear-progress>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "balance-list",
  setup() {
    const balance = ref([
      {
        name: "Juan",
        balance: 400
      },
      {
        name: "Pedro",
        balance: 200
      },
      {
        name: "Maria",
        balance: 150
      },
      {
        name: "Jose",
        balance: -40
      }
    ]);
    return {
      balance
    };
  },
  methods: {
    lineColor(line) {
      if (line.balance > 0) {
        return "positive";
      }
      return "negative";
    },
    linePercentage(line) {
      const total = this.balance.reduce((acc, cur) => acc + cur.balance, 0);
      let value = total === 0 ? 0 : Math.abs(line.balance / total);
      let percentage = {
        value,
        label: (value * 100).toFixed(0) + "%"
      };
      return percentage;
    }
  }
};
</script>
