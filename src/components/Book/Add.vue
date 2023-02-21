<template>
  <q-item clickable v-ripple class="text-primary" @click="formDialog = true">
    <q-item-section avatar>
      <q-icon name="add_circle" />
    </q-item-section>
    <q-item-section>
      {{ $t("book.newBook") }}
    </q-item-section>
  </q-item>
  <q-dialog v-model="formDialog" persistent>
    <q-card>
      <q-form @submit="addBook()">
        <q-card-section class="text-subtitle2 text-primary">
          <q-icon name="add_circle" color="primary" size="md" />
          {{ $t("book.newBook") }}
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-section class="row items-center">
          <q-input
            outlined
            v-model="name"
            :label="$t('book.name')"
            class="full-width"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 2) || $t('book.nameIsRequired')
            ]"
          />
        </q-card-section>
        <q-card-section class="row items-center">
          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ $t("book.icon") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item-section>
            <q-btn-toggle
              v-model="icon"
              flat
              spread
              :options="[
                { icon: 'star', value: 'star' },
                { icon: 'shopping_cart', value: 'shopping_cart' },
                { icon: 'savings', value: 'savings' },
                { icon: 'account_balance', value: 'account_balance' },
                { icon: 'favorite', value: 'favorite' }
              ]"
            />
          </q-item-section>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ $t("book.multiBalanceTitle") }}</q-item-label>
              <q-item-label caption>
                {{ $t("book.multiBalanceDescription") }}
              </q-item-label>
            </q-item-section>
            <q-item-section avatar top>
              <q-checkbox
                v-model="multi_balance"
                @update:model-value="toggleMemberList"
              />
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section v-if="multi_balance">
          <q-item>
            <q-item-section>
              <q-list
                bordered
                separator
                class="full-width rounded-borders"
                dense
              >
                <q-item-label header>
                  {{
                    $t("book.membersCountMessage", {
                      count: members.length,
                      max: book.maxMembers
                    })
                  }}
                </q-item-label>
                <q-item
                  :clickable="!member.owner"
                  :v-ripple="!member.owner"
                  v-for="member in members"
                  :key="member.id"
                >
                  <q-item-section>
                    <q-item-label>
                      {{ member.displayName }}
                      <q-badge color="grey" v-if="member.id === user.user.id">
                        {{ $t("book.me") }}
                      </q-badge>
                      <q-popup-edit
                        v-model="member.displayName"
                        auto-save
                        v-slot="scope"
                        v-if="member.id !== user.user.id"
                      >
                        <q-input
                          v-model="scope.value"
                          dense
                          autofocus
                          counter
                          @keyup.enter="scope.set"
                        />
                      </q-popup-edit>
                    </q-item-label>
                    <q-tooltip v-if="!member.owner">
                      {{ $t("book.edit") }}
                    </q-tooltip>
                  </q-item-section>
                  <q-item-section v-if="member.owner" avatar>
                    <q-icon name="verified_user"> </q-icon>
                    <q-tooltip>
                      {{ $t("book.owner") }}
                    </q-tooltip>
                  </q-item-section>
                </q-item>
                <q-item v-if="members.length < book.maxMembers">
                  <q-item-section>
                    <q-input
                      bottom-slots
                      v-model="newMember"
                      :label="$t('book.newMember')"
                      counter
                      maxlength="12"
                      dense
                      :rules="[
                        (val) =>
                          (val && val.length > 2) || $t('book.nameIsRequired')
                      ]"
                      ref="newMemberInput"
                    >
                      <template v-slot:append>
                        <q-btn
                          round
                          dense
                          icon="add"
                          color="primary"
                          @click="addMember"
                          flat
                        />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator color="primary" inset />
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('book.cancel')"
            color="negative"
            v-close-popup
          />
          <q-btn :label="$t('book.add')" color="primary" @click="addBook" />
        </q-card-actions>
        <q-inner-loading :showing="loading" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { bookStore } from "src/stores/book";
import { userStore } from "src/stores/user";
import { uid, useQuasar } from "quasar";

export default {
  name: "add-book",
  setup() {
    const formDialog = ref(false);
    const name = ref("");
    const icon = ref("star");
    const multi_balance = ref(false);
    const book = bookStore();
    const loading = ref(false);
    const user = userStore();
    const newMember = ref("");
    const members = ref([
      {
        id: user.user.id,
        displayName: user.user.displayName,
        owner: true
      }
    ]);
    const quasar = useQuasar();
    const newMemberInput = ref(null);

    const addBook = async () => {
      if (name.value.length > 2) {
        loading.value = true;
        await book.addBook({
          name: name.value,
          multi_balance: multi_balance.value,
          icon: icon.value,
          members: members.value.map((m) => m.id),
          membersInfo: members.value
        });
        loading.value = false;
        formDialog.value = false;
      }
    };

    const addMember = () => {
      if (
        members.value.find(
          (m) => m.displayName.toLowerCase() === newMember.value.toLowerCase()
        )
      ) {
        quasar.notify({
          title: "Error",
          message: "Member name already in use",
          color: "negative"
        });
        return;
      }

      if (newMember.value.length < 3) {
        return;
      }
      members.value.push({
        id: uid(),
        displayName: newMember.value,
        owner: false
      });
      newMember.value = "";
      newMemberInput.value.resetValidation();
    };

    const toggleMemberList = () => {
      if (!multi_balance.value) {
        members.value = [
          {
            id: user.user.id,
            displayName: user.user.displayName,
            owner: true
          }
        ];
      }
    };

    return {
      formDialog,
      name,
      icon,
      multi_balance,
      book,
      loading,
      members,
      newMember,
      quasar,
      newMemberInput,
      addBook,
      addMember,
      user,
      toggleMemberList
    };
  }
};
</script>
