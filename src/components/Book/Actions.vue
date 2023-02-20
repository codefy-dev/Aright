<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="sticky">
      <q-fab
        color="primary"
        icon="add"
        direction="left"
        :label="$q.screen.gt.xs ? $t('book.addRegister') : ''"
      >
        <q-fab-action
          color="positive"
          @click="openAddDialog()"
          icon="savings"
          :label="$q.screen.gt.xs ? $t('book.credit') : ''"
        />
        <q-fab-action
          color="secondary"
          @click="mockLine()"
          icon="auto_fix_high"
        />
        <q-fab-action
          color="negative"
          @click="openAddDialog('debit')"
          icon="shopping_cart"
          :label="$q.screen.gt.xs ? $t('book.debit') : ''"
        />
      </q-fab>
    </q-page-sticky>
    <div v-else class="full-width q-gutter-md">
      <q-btn
        color="positive"
        @click="openAddDialog()"
        icon="savings"
        :label="$t('book.credit')"
      />
      <q-btn
        color="negative"
        @click="openAddDialog('debit')"
        icon="shopping_cart"
        :label="$t('book.debit')"
      />
    </div>
    <q-dialog v-model="addDialog">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">
            <q-avatar
              :icon="actionIcon()"
              :color="acctionColor()"
              text-color="white"
            />
            {{ $t("book.new") }}
            <strong :class="['text-' + acctionColor()]">{{
              actionTitle()
            }}</strong
            >.
          </div>
        </q-card-section>
        <q-card-section vertical>
          <q-form @submit="add" class="q-gutter-xs">
            <q-input
              outlined
              v-model.number="newLine.amount"
              :label="$t('book.amount')"
              required
              type="number"
            />
            <q-select
              outlined
              v-model="newLine.channel"
              :options="book.availableGateways"
              :label="$t('book.gateway')"
              required
            />
            <q-input
              outlined
              v-model="newLine.description"
              :label="$t('book.description')"
              required
            />
            <q-card-actions align="right">
              <q-btn
                color="primary"
                :label="$t('book.save')"
                icon="save"
                type="submit"
                :loading="loading"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { bookStore } from "stores/book/";

export default {
  name: "cash-flow-actions",
  props: {
    sticky: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const book = bookStore();
    const addDialog = ref(false);
    const newLine = ref({
      description: "",
      amount: "",
      type: "credit",
      channel: {}
    });
    const loading = ref(false);
    return {
      addDialog,
      newLine,
      book,
      loading
    };
  },
  methods: {
    openAddDialog(type = "credit") {
      this.newLine = {
        description: "",
        amount: "",
        type: "credit",
        channel: this.book.availableGateways[0]
      };
      this.newLine.type = type;
      this.addDialog = true;
    },
    acctionColor() {
      return "credit" === this.newLine.type ? "positive" : "negative";
    },
    actionIcon() {
      return "credit" === this.newLine.type ? "savings" : "shopping_cart";
    },
    actionTitle() {
      return "credit" === this.newLine.type
        ? this.$t("book.credit")
        : this.$t("book.debit");
    },
    async add() {
      this.newLine.channel =
        this.newLine.channel?.value || this.newLine.channel;
      this.loading = true;
      await this.book.addLine(this.newLine);
      this.loading = false;
      this.addDialog = false;
      this.newLine = defaultLine;
    },
    async mockLine() {
      let mockDescriptions = [
        "Compra Varia",
        "Pago Cuota",
        "Compra Comida",
        "Compra Frutas",
        "Compra Licores",
        "Capital",
        "Compra Ropa",
        "Cine",
        "Gasolina",
        "Cobro de factura",
        "Alquiler",
        "Luz y Agua",
        "Sueldo",
        "Cena",
        "Prestamo"
      ];
      this.newLine = {
        type: Math.random() < 0.5 ? "credit" : "debit",
        description:
          mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)],
        amount: Math.floor(Math.random() * (1000000 - 10000 + 1) + 10000),
        channel:
          this.book.availableGateways[
            Math.floor(Math.random() * this.book.availableGateways.length)
          ]
      };
      await this.add();
    }
  },
  mounted() {}
};
</script>
