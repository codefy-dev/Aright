<template>
  <div class="q-my-none vertical-top full-height" style="width: 100%; max-width: 850px">
    <q-list separator dense class="bg-white fit  vertical-top" v-if="!loading">
      <q-item class="justify-end">
        <q-item-section class="col-5">
          <q-input outlined label="Balance" v-model="balance" dense readonly >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item v-for="line in book.book" :key="line.id">
        <q-item-section avatar top class="col-1 gt-sm">
          <q-item-label caption><small class="text-grey-8">{{ $filters.dateOrTime(line.created_at) }}</small></q-item-label>
          <q-icon :name="lineIcon(line)" :color="lineColor(line)" />
        </q-item-section>
        <q-item-section top class="col-xs-6 col-sm-6 col-md-7 col-lg-7 col-xl-7">
          <q-item-label lines="1">
            <span class="text-weight-regular">
              <q-icon :name="lineChannel(line).icon" :color="lineColor(line)" size="xs" /> {{ lineChannel(line).label }}
            </span>
          </q-item-label>
          <q-item-label caption lines="1">
            <small class="text-grey-8 lt-md" >{{ $filters.dateOrTime(line.created_at) }}</small> {{ line.description }}
          </q-item-label>
        </q-item-section>
        <q-item-section side class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xl-2">
          <q-item-label caption>Monto</q-item-label>
          <q-item-label lines="1">
            <span :class="['text-weight-regular', 'text-' + lineColor(line)]">
              {{ $filters.money(line.amount) }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xl-2">
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
        <q-item-section class="col-6 text-primary text-center">
          Has llegado al final, No hay mas registros disponibles
        </q-item-section>
      </q-item>
      <q-item v-else-if="!book.empty" class="justify-center">
        <q-item-section class="col-6">
          <q-btn flat color="primary" icon="expand_more"  @click="book.nextPage()" :loading="loading" />
        </q-item-section>
      </q-item>
      <q-item v-else class="justify-center">
        <q-item-section class="col-6 full-height text-center">
          No hay registros disponibles
        </q-item-section>
      </q-item>
      <Actions />
    </q-list>
    <q-list v-else separator dense class="col-xl-8 bg-white rounded-borders" >
      <q-item>
        <q-item-section>
          <q-linear-progress indeterminate />
        </q-item-section>
      </q-item>
      <q-item v-for="line in book.linesPerPage" :key="line">
        <q-item-section>
          <q-linear-progress indeterminate />
        </q-item-section>
        <q-item-section top class="col-6">
          <q-item-label lines="1">
            <span class="text-weight-regular">
              <q-skeleton type="QRadio" /> <q-skeleton type="rect" />
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="col-3">
          <q-skeleton type="QBadge" />
        </q-item-section>
        <q-item-section side class="col-3">
          <q-skeleton type="QBadge" />
        </q-item-section>
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
    }
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

