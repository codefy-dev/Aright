<template>
  <q-card v-if="isReady">
    <q-form>
      <q-card-section class="text-subtitle2 text-primary row items-center">
        <div class="text-h6">
          <q-icon
            :name="edit ? 'edit' : 'add_circle'"
            color="primary"
            size="md"
          />
          {{ edit ? $t("book.editBook") : $t("book.newBook") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="storeBook.dialogHide" />
      </q-card-section>
      <q-separator color="primary" inset />
      <q-card-section class="row items-center">
        <q-input
          outlined
          v-model="book.name"
          :label="$t('book.name')"
          class="full-width"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 2) || $t('book.nameIsRequired')
          ]"
        />
      </q-card-section>
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("book.icon") }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item-section>
          <q-btn-toggle
            v-model="book.icon"
            flat
            spread
            :options="[
              { icon: 'star', value: 'star' },
              { icon: 'shopping_cart', value: 'shopping_cart' },
              { icon: 'savings', value: 'savings' },
              { icon: 'favorite', value: 'favorite' },
              { icon: 'book', value: 'book' },
              {
                icon: 'account_balance_wallet',
                value: 'account_balance_wallet'
              }
            ]"
          />
        </q-item-section>
      </q-card-section>
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("book.multiBalanceTitle") }}</q-item-label>
            <q-item-label caption>
              {{ $t("book.multiBalanceDescription") }}
            </q-item-label>
          </q-item-section>
          <q-item-section avatar top>
            <q-toggle
              v-model="book.multi_balance"
              @update:model-value="toggleMemberList"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section v-if="book.multi_balance">
        <q-item>
          <q-item-section>
            <q-list bordered separator class="full-width rounded-borders" dense>
              <q-item-label header>
                {{
                  $t("book.membersCountMessage", {
                    count: book.members.length,
                    max: storeBook.maxMembers
                  })
                }}
              </q-item-label>
              <q-item
                :clickable="!member.owner"
                :v-ripple="!member.owner"
                v-for="member in book.membersInfo"
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
                    {{ $t("edit") }}
                  </q-tooltip>
                </q-item-section>
                <q-item-section v-if="member.owner" avatar>
                  <q-icon name="verified_user"> </q-icon>
                  <q-tooltip>
                    {{ $t("book.owner") }}
                  </q-tooltip>
                </q-item-section>
              </q-item>
              <q-item v-if="book.members.length < storeBook.maxMembers">
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
      <q-card-actions :align="edit ? 'around' : 'right'">
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          icon="delete"
          @click="storeBook.deleteBook(book)"
          v-if="edit"
        />
        <q-btn
          :label="edit ? $t('save') : $t('add')"
          color="primary"
          @click="send"
          :icon="edit ? 'save' : 'add'"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { ref } from "vue";
import { bookStore } from "src/stores/book";
import { userStore } from "src/stores/user";
import { uid, useQuasar } from "quasar";

export default {
  name: "edit-book",
  props: {
    bookId: {
      type: String,
      default: null
    }
  },
  setup() {
    const user = userStore();
    const storeBook = bookStore();
    const book = ref({
      name: "",
      icon: "star",
      multi_balance: false,
      membersInfo: [
        {
          id: user.user.id,
          displayName: user.user.displayName,
          owner: true
        }
      ],
      members: [user.user.id]
    });
    const edit = ref(false);
    const newMember = ref("");
    const newMemberInput = ref(null);
    const isReady = ref(false);

    return {
      book,
      edit,
      storeBook,
      newMember,
      user,
      isReady,
      newMemberInput
    };
  },
  methods: {
    async send() {
      if (await this.storeBook.bookValidation(this.book)) {
        if (this.edit) {
          await this.storeBook.editBook(this.book);
        } else {
          await this.storeBook.addBook(this.book);
        }
      }
    },
    deleteMember(member) {
      this.book.membersInfo = this.book.membersInfo.filter(
        (m) => m.id !== member.id
      );
      this.book.members = this.book.members.filter((m) => m !== member.id);
    },
    addMember() {
      if (this.newMember.length < 3) {
        return;
      }
      if (
        this.book.membersInfo.find(
          (m) => m.displayName.toLowerCase() === this.newMember.toLowerCase()
        )
      ) {
        this.$q.notify({
          title: this.$t("error"),
          message: this.$t("book.memberAlreadyInUse"),
          color: "negative"
        });
        return;
      }

      this.book.membersInfo.push({
        id: uid(),
        displayName: this.newMember,
        owner: false
      });
      this.book.members.push(uid());
      this.newMember = "";
      this.newMemberInput.resetValidation();
    },
    toggleMemberList(value) {
      if (value && !this.book.membersInfo) {
        this.book.membersInfo = [
          {
            id: this.user.user.id,
            displayName: this.user.user.displayName,
            owner: true
          }
        ];
        this.book.members = [this.user.user.id];
      }
    }
  },
  async mounted() {
    if (this.bookId) {
      this.book = { ...(await this.storeBook.getBook(this.bookId)) };
      this.edit = this.book?.id ? true : false;
      this.isReady = true;
    } else {
      this.isReady = true;
    }
  }
};
</script>
