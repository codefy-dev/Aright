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
        name: "Pedro",
        balance: 10000,
        credit: 10000,
        debit: 0
      },
      {
        name: "Jose",
        balance: 80000,
        credit: 80000,
        debit: 0
      },
      {
        name: "Juan",
        balance: 25000,
        credit: 25000,
        debit: 0
      },
      {
        name: "Maria",
        balance: 15000,
        credit: 15000,
        debit: 0
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
      // console.log(this.groupByPerson());
      return percentage;
    },
    groupByPerson() {
      const grouped = this.balance.reduce((acc, cur) => {
        if (acc[cur.name]) {
          acc[cur.name] += cur.balance;
        } else {
          acc[cur.name] = cur.balance;
        }
        return acc;
      }, {});
      return grouped;
    }
  }
};
</script>
