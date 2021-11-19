import apollo from '@/plugins/apollo'
import CategoriesQuery from './../graphql/Categories.gql'

const categories = async ({ operation }) => {
  try {
    const response = await apollo.query({
      query: CategoriesQuery,
      variables: { operation: operation ? operation.toUpperCase() : operation }
    })
    return response.data.categories
  } catch (e) {
    console.log(e)
  }
}

export default {
  categories
}
