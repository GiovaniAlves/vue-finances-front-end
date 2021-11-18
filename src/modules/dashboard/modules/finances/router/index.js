const RecordsAdd = () => import('../views/RecordsAdd')
const RecordsHome = () => import('../views/RecordsHome')

export default [
  {
    path: 'records', component: RecordsHome, meta: { requiresAuth: true }, alias: ['home', '']
  },
  {
    path: 'records/add', component: RecordsAdd, meta: { requiresAuth: true }, name: 'recordsAdd'
  }
]
