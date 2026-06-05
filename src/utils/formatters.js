const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
})

export const formatCurrency = (value) => {
  return currencyFormatter.format(value || 0)
}

export const formatPercent = (value, decimals = 2) => {
  return `${(value || 0).toFixed(decimals)}%`
}
