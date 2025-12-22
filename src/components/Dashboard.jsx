import React from 'react'
import { useCalculation } from '../hooks/useCalculation'
import { Euro, Home, TrendingUp, Calculator } from 'lucide-react'

const Dashboard = () => {
  const { state, clearData } = useCalculation()

  const handleClearData = () => {
    if (window.confirm('Möchten Sie wirklich alle Daten zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) {
      clearData()
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value || 0)
  }

  const formatPercent = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  const stats = [
    {
      title: 'Gesamtinvestition',
      value: formatCurrency(state.gesamtinvestition),
      icon: Euro,
      color: 'bg-blue-500'
    },
    {
      title: 'Kaufpreis pro m²',
      value: formatCurrency(state.kaufpreisProQm),
      icon: Home,
      color: 'bg-green-500'
    },
    {
      title: 'Bruttomietrendite',
      value: formatPercent(state.bruttomietrendite),
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Monatlicher Cashflow',
      value: formatCurrency(state.monatlicheCashflow),
      icon: Calculator,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Immobilien Investment Dashboard
        </h1>
        <p className="text-gray-600">
          Übersicht Ihrer Immobilien-Investition
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Investitionsübersicht
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Kaufpreis:</span>
              <span className="font-medium">{formatCurrency(state.kaufpreis)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nebenkosten:</span>
              <span className="font-medium">
                {formatCurrency(
                  state.berechneteNebenkosten
                    ? Object.values(state.berechneteNebenkosten).reduce((sum, val) => sum + val, 0)
                    : Object.values(state.kaufnebenkosten).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                )}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-semibold">Gesamtinvestition:</span>
              <span className="font-bold text-primary-600">
                {formatCurrency(state.gesamtinvestition)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Renditeanalyse
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nettokaltmiete/Monat:</span>
              <span className="font-medium">{formatCurrency(state.nettokaltmiete)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bruttomietrendite:</span>
              <span className="font-medium">{formatPercent(state.bruttomietrendite)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-semibold">Nettomietrendite:</span>
              <span className="font-bold text-green-600">
                {formatPercent(state.nettomietrendite)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Optionen
        </h3>
        <div>
          <button
            onClick={handleClearData}
            className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 w-full sm:w-auto"
          >
            Daten zurücksetzen
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard