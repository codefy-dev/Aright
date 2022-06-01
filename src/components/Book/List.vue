<template>
  <div style="width: 100%" class="rounded-borders bg-white q-my-md">
    <q-list separator dense class="col-12">
      <q-item class="justify-end">
        <q-item-section class="col-5">
          <q-input outlined label="Disponibles" v-model="balance" dense readonly >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item v-for="line in book.book" :key="line.id" >
        <!-- <q-item-section avatar top class="col-1">
          <q-item-label caption><small class="text-grey-8">{{ $filters.dateOrTime(line.created_at) }}</small></q-item-label>
          <q-icon :name="lineIcon(line)" :color="lineColor(line)" />
        </q-item-section> -->

        <q-item-section top class="col-6">
          <q-item-label lines="1">
            <span class="text-weight-regular">
              <q-icon :name="lineChannel(line).icon" :color="lineColor(line)" size="xs" /> {{ lineChannel(line).label }}
            </span>
          </q-item-label>
          <q-item-label caption lines="1">
            <small class="text-grey-8">{{ $filters.dateOrTime(line.created_at) }}</small> {{ line.description }}
          </q-item-label>
        </q-item-section>

        <q-item-section side class="col-3">
          <q-item-label caption>Monto</q-item-label>
          <q-item-label lines="1">
            <span :class="['text-weight-regular', 'text-' + lineColor(line)]">
              {{ $filters.money(line.amount) }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="col-3">
          <q-item-label caption>Saldo</q-item-label>
          <q-item-label lines="1">
            <span :class="['text-weight-regular', line.balance ? 'text-positive' : 'text-negative']">
              {{ $filters.money(line.balance) }}
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="book.pagination.lastPage" class="justify-center">
        <q-item-section avatar class="col-1">
          <q-icon color="primary" name="hiking" />
        </q-item-section>
        <q-item-section class="col-6 text-primary">
          Has llegado al final, No hay mas registros disponibles
        </q-item-section>
      </q-item>
      <q-item class="justify-center">
        <q-btn
          v-if="book.pagination.page > 2"
          icon="first_page"
          :disable="book.pagination.page === 1"
          @click="book.firstPage()"
          unelevated
          color="info"
          class="q-mr-sm q-my-md"
        />
        <q-btn
          icon="chevron_left"
          :disable="book.pagination.page === 1"
          @click="book.prevPage()"
          unelevated
          color="info"
          class="q-mx-sm q-my-md"
        />
        <q-btn
          icon="chevron_right"
          @click="book.nextPage()"
          :disable="book.pagination.lastPage"
          unelevated
          color="info"
          class="q-ml-sm q-my-md"
        />
      </q-item>
    </q-list>
    <Actions />
  </div>
</template>

<script>
import { ref } from 'vue'
import { bookStore } from 'stores/book/'
import Actions from 'components/Book/Actions.vue'

export default {
  name: 'income-outcome-list',
  components: {
    Actions
  },
  setup () {
    const book = bookStore()
    const loading = ref(false)
    return {
      loading,
      book
    }
  },
  methods: {
    async fetchPage () {
      this.loading = true
      await this.book.fetchPage()
      this.loading = false
    },
    lineIcon (line) {
      if (line.type === 'income') {
        return 'add'
      }
      return 'remove'
    },
    lineColor (line) {
      if (line.type === 'income') {
        return 'positive'
      }
      return 'negative'
    },
    lineChannel (line) {
      return this.book?.availableChannels?.find(channel => channel.value === line.channel)
    },
  },
  computed: {
    balance () {
      return this.$filters.money(this.book.balance)
    }
  },
  mounted () {
    this.fetchPage()
  }
}
</script>

