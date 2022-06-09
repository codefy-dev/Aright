<template>
  <q-list padding>
    <q-item>
      <q-item-section>
        <q-item-label caption>Libros</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="inbox" />
      </q-item-section>
      <q-item-section>
        Inbox
      </q-item-section>
    </q-item>

    <q-item active clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="star" />
      </q-item-section>

      <q-item-section>
        Star
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="send" />
      </q-item-section>

      <q-item-section>
        Send
      </q-item-section>
    </q-item>

    <q-separator />

    <q-item clickable v-ripple class="text-primary">
      <q-item-section avatar>
        <q-icon name="add"  />
      </q-item-section>

      <q-item-section>
        Crear Nuevo
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'book-list',
  setup () {
    return {
    }
  }

}
</script>
