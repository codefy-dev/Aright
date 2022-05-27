<template>
  <div style="width: 100%" class="rounded-borders bg-white q-my-md">
    <Actions />
    <q-list bordered separator dense class="col-12">
      <q-item class="justify-between">
        <q-item-section  top class="col-2">
          <q-item-label caption>
            Disponibles
          </q-item-label>
          <q-chip size="md" icon="attach_money">{{ $filters.money(book.balance) }}</q-chip>
        </q-item-section>
        <q-item-section  top class="col-4">
          <q-input dense debounce="300" v-model="filter" placeholder="Busqueda...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item v-for="line in book.book" :key="line.id" >
        <q-item-section avatar top class="col-1">
          <q-item-label caption><small class="text-grey-8">{{ $filters.dateOrTime(line.created_at) }}</small></q-item-label>
          <q-icon :name="lineIcon(line)" :color="lineColor(line)" />
        </q-item-section>

        <q-item-section top class="col-7">
          <q-item-label lines="1">
            <span class="text-weight-medium">
              <q-icon :name="lineChannel(line).icon" :color="lineColor(line)" size="sm" /> {{ lineChannel(line).label }}
            </span>
          </q-item-label>
          <q-item-label caption lines="1">
            {{ line.description }}
          </q-item-label>
        </q-item-section>

        <q-item-section side class="col-2">
          <q-item-label caption>Monto</q-item-label>
          <q-item-label lines="1">
            <span :class="['text-weight-medium', 'text-' + lineColor(line)]">
              {{ $filters.money(line.amount) }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="col-2">
          <q-item-label caption>Saldo</q-item-label>
          <q-item-label lines="1">
            <span :class="['text-weight-medium', line.balance ? 'text-positive' : 'text-negative']">
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
    const filter = ref('')
    const loading = ref(false)
    return {
      filter,
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
    filteredBook () {
      if (!this.book.book) {
        return []
      }
      return this.book.book.filter(line => {
        return line.description.toLowerCase().includes(this.filter.toLowerCase())
      })
    }
  },
  mounted () {
    this.fetchPage()
  }
}
</script>

