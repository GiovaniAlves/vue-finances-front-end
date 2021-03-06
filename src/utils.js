const currencyFormatter = ({
  locale,
  currency
} = {
  locale: 'pt-BR',
  currency: 'BRL'
}) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })
}

const errorHandler = (error, vm, info) => {
  console.log('Error Handler: ', 'Instancia vue: ', vm, 'error: ', error, 'info: ', info)
  const jwtErrors = ['jwt malformed', 'jwt expired', 'jwt not active', 'invalid token']
  if (jwtErrors.some(jwtError => error.message.includes(jwtError))) {
    vm.$router.push({
      path: '/login',
      query: { redirect: vm.$route.path }
    })
  }
}

const formatError = message => {
  const messageSplit = message.split(':')
  return messageSplit[messageSplit.length - 1].trim()
}

const generateChartOptions = (type) => {
  let tooltips = {}
  switch (type) {
    case 'bar':
      tooltips = {
        callbacks: {
          label (tooltip, data) {
            return data.datasets[tooltip.datasetIndex].label
          }
        }
      }
      break

    case 'doughnut':
      tooltips = {
        callbacks: {
          label (tooltip, data) {
            const label = data.labels[tooltip.index]
            const value = currencyFormatter()
              .format(data.datasets[tooltip.datasetIndex].data[tooltip.index])
            return `${label}: ${value}`
          }
        }
      }
      break
  }

  const scales = {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }

  return {
    scales,
    tooltips
  }
}

const generateChartConfigs = opts => {
  const { type } = opts
  const data = generateChartData(opts)
  const options = generateChartOptions(type)

  return {
    data,
    type,
    options
  }
}

// Essa função vai gerar os dados para os gráficos
const generateChartData = ({ items, keyToGroup, keyOfValue, aliases, type, backgroundColors }) => {
  const grouped = groupBy(items, keyToGroup, idx)
  const response = {}

  for (const key in grouped) {
    response[(aliases && aliases[key]) || key] =
      grouped[key].reduce(
        function (acumulated, item) {
          return acumulated + item[keyOfValue]
        }, 0)
  }

  const labels = Object.keys(response)

  switch (type) {
    case 'bar':
      return {
        datasets: labels.map((label, index) => ({
          label: `${label}: ${currencyFormatter().format(response[label])}`,
          data: [response[label] >= 0 ? response[label] : -response[label]],
          backgroundColor: [response[label] >= 0 ? backgroundColors[1] : backgroundColors[0]],
          borderWidth: 0
        })),
        labels: ['']
      }

    case 'doughnut':
      return {
        datasets: [{
          data: labels.map(label => response[label] >= 0 ? response[label] : -response[label]),
          backgroundColor: backgroundColors,
          borderWidth: 0
        }],
        labels: items.length > 0 ? labels : []
      }
  }
}

const groupBy = (array, key, makeCurrentKey) => {
  return array.reduce((acumulated, item) => {
    const currentKey = makeCurrentKey(item, key) // (record == item) AND (key == date)
    return {
      ...acumulated,
      [currentKey]: [
        ...(acumulated[currentKey] || []),
        item
      ]
    }
  }, {})
}

const idx = (object, keyPath) => { // Ex: record.category.user.name
  const keys = keyPath.split('.') // Ex: ['record', 'category', 'user', 'name' ]
  return keys.reduce(
    (obj, current) => (obj && obj[current] !== undefined) ? obj[current] : null, object
  )
}

/* Exemplo de utilização da função idx
const myObject = {
  record: {
    category: {
      user: {
        name: 'Giovani',
        email: 'giovani@email.com'
      }
    }
  }
}

console.log('IDX>> ', idx(myObject, 'record.category.user')) */

const registerVuexModule = (rootStore, moduleName, store) => {
  if (!(moduleName in rootStore._modules.root._children)) {
    rootStore.registerModule(moduleName, store)
  }
}

export {
  currencyFormatter,
  errorHandler,
  formatError,
  generateChartConfigs,
  groupBy,
  registerVuexModule
}
