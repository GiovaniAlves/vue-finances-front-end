import apollo from '@/plugins/apollo'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import AccountsQuery from './../graphql/Accounts.gql'
import AccountCreateMutation from './../graphql/AccountCreate.gql'

const accounts = () => {
  const queryRef = apollo.watchQuery({
    query: AccountsQuery
  })
  return from(queryRef)
    .pipe(
      map(res => res.data.accounts)
    )
}

const createAccount = async variables => {
  const response = await apollo.mutate({
    mutation: AccountCreateMutation,
    variables,
    update: (proxy, { data: { createAccount } }) => {
      try {
        const AccountData = proxy.readQuery({
          query: AccountsQuery
        })

        AccountData.accounts = [...AccountData.accounts, createAccount]

        proxy.writeQuery({
          query: AccountsQuery,
          data: AccountData.accounts
        })
      } catch (e) {
        console.log('Query "Accounts" has not been read yet!', e)
      }
    }
  })

  return response.data.createAccount
}

export default {
  accounts,
  createAccount
}
