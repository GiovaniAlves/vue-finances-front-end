<template>
  <v-container flex text-center class="mt-2">
    <v-layout
      row
      wrap>

      <v-flex
        xs12
        sm6
        md4
        lg4>
        <NumericDisplay :color="color"/>
      </v-flex>

      <v-flex
        xs12
        sm6
        md8
        lg8>

        <v-card>
          <v-card-text>
            <v-form>

              <v-dialog
                ref="dateDialog"
                :return-value.sync="record.date"
                v-model="shownDateDialog"
                persistent
                width="290px">

                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="date"
                    label="Vencimento"
                    prepend-icon="event"
                    type="text"
                    readonly
                    :value="formattedDate"
                    v-on="on">

                  </v-text-field>
                </template>

                <v-date-picker
                  :color="color"
                  locale="pt-br"
                  scrollable
                  v-model="dateDialogValue">
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      :color="color"
                      @click="cancelDateDialog">Cancelar
                    </v-btn>
                    <v-btn
                      text
                      :color="color"
                      @click="$refs.dateDialog.save(dateDialogValue)">OK
                    </v-btn>
                </v-date-picker>

              </v-dialog>

              <v-select
                name="account"
                label="Conta"
                prepend-icon="account_balance"
                :items="accounts"
                item-text="description"
                item-value="id"
                v-model="$v.record.accountId.$model"></v-select>

              <v-select
                name="category"
                label="Categoria"
                prepend-icon="class"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.categoryId.$model"></v-select>

              <v-text-field
                name="description"
                label="Descrição"
                prepend-icon="description"
                type="text"
                v-model.trim="$v.record.description.$model"></v-text-field>

              <v-text-field
                v-show="shownTagsInput"
                name="tags"
                label="Tags (Separadas por virgula)"
                prepend-icon="label"
                type="text"
                v-model.trim="record.tags"></v-text-field>

              <v-text-field
                v-show="shownNoteInput"
                name="note"
                label="Observações"
                prepend-icon="note"
                type="text"
                v-model.trim="record.note"></v-text-field>
            </v-form>

            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on="on"
                  @click="shownTagsInput = !shownTagsInput">
                  <v-icon :color="color">label</v-icon>
                </v-btn>
              </template>
              <span>Adicionar Tags</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on="on"
                  @click="shownNoteInput = !shownNoteInput">
                  <v-icon :color="color">note</v-icon>
                </v-btn>
              </template>
              <span>Adicionar Observações</span>
            </v-tooltip>

          </v-card-text>
        </v-card>

        <v-btn
          color="secondary"
          large
          fab
          class="mt-4 mr-3"
          @click="$router.back()">
          <v-icon>close</v-icon>
        </v-btn>

        <v-btn
          :color="color"
          large
          fab
          class="mt-4"
          @click="submit">
          <v-icon>check</v-icon>
        </v-btn>

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

import { decimal, minLength, required } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import moment from 'moment'

import AccountsService from './../services/accounts-service'
import CategoriesService from './../services/categories-service'
import NumericDisplay from '../components/NumericDisplay'

export default {
  name: 'RecordsAdd',
  components: { NumericDisplay },
  data () {
    return {
      accounts: [],
      categories: [],
      dateDialogValue: moment().format('YYYY-MM-DD'),
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format('YYYY-MM-DD'),
        accountId: '',
        categoryId: '',
        description: '',
        tags: '',
        note: ''
      },
      shownDateDialog: false,
      shownTagsInput: false,
      shownNoteInput: false
    }
  },
  computed: {
    color () {
      switch (this.record.type) {
        case 'CREDIT':
          return 'primary'
        case 'DEBIT':
          return 'error'

        default:
          return 'primary'
      }
    },
    formattedDate () {
      return moment(this.record.date).format('DD/MM/YYYY')
    }
  },
  validations: {
    record: {
      type: { required },
      amount: {
        decimal,
        required,
        differenthanZero: value => value !== 0
      },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: {
        required,
        minLength: minLength(6)
      }
    }
  },
  async created () {
    this.changeTitle(this.$route.query.type)
    this.accounts = await AccountsService.accounts()
    this.categories = await CategoriesService.categories({ operation: this.$route.query.type })
  },
  async beforeRouteUpdate (to, from, next) {
    const { type } = to.query
    this.changeTitle(type)
    this.record.type = type.toUpperCase()
    this.categories = await CategoriesService.categories({ operation: type })
    next()
  },
  methods: {
    ...mapActions(['setTitle']),
    cancelDateDialog () {
      this.shownDateDialog = false
      this.dateDialogValue = this.record.date
    },
    changeTitle (recordType) {
      let title
      switch (recordType) {
        case 'credit':
          title = 'Nova Receita'
          break
        case 'debit':
          title = 'Nova Despesa'
          break
        default:
          title = 'Novo Lançamento'
      }
      this.setTitle({ title })
    },
    submit () {
      console.log('Form: ', this.record)
    }
  }
}
</script>
