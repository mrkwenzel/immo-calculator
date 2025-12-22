import React, { useState } from 'react'
import { useCalculation } from '../hooks/useCalculation'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const CashflowAnalysis = () => {
  const { state } = useCalculation()
  const [years, setYears] = useState(10)
  const [mietSteigerung, setMietSteigerung] = useState(2)
  const [kostenSteigerung, setKostenSteigerung] = useState(2)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value || 0)
  }

  const calculateCashflowProjection = () => {
    const projection = []
    let currentMiete = (parseFloat(state.nettokaltmiete) || 0) + (parseFloat(state.stellplatzmiete) || 0)
    let currentKosten = parseFloat(state.nichtUmlagefaehigeKosten) || 0
    const mtlBankrateGesamt = parseFloat(state.monatlicherKapitaldienst) || 0
    const mtlBankrateRelevant = parseFloat(state.kapitaldienstRelevantForCashflow) || 0

    for (let year = 1; year <= years; year++) {
      if (year > 1) {
        currentMiete *= (1 + mietSteigerung / 100)
        currentKosten *= (1 + kostenSteigerung / 100)
      }

      const jahresmiete = currentMiete * 12
      const jahreskosten = currentKosten * 12
      const jahresOperativerCashflow = jahresmiete - jahreskosten
      const jahresBankrateGesamt = mtlBankrateGesamt * 12
      const jahresBankrateRelevant = mtlBankrateRelevant * 12

      const nettoCashflow = jahresOperativerCashflow - jahresBankrateRelevant
      const kumuliert = projection.length > 0
        ? projection[projection.length - 1].kumuliert + nettoCashflow
        : nettoCashflow

      projection.push({
        year,
        jahresmiete,
        jahreskosten,
        jahresOperativerCashflow,
        jahresBankrateGesamt,
        nettoCashflow,
        kumuliert,
        monatlicheMiete: currentMiete,
        monatlicheKosten: currentKosten
      })
    }

    return projection
  }

  const projection = calculateCashflowProjection()
  const totalCashflow = projection[projection.length - 1]?.kumuliert || 0
  const averageYearlyCashflow = totalCashflow / years

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cashflow-Analyse
        </h1>
        <p className="text-gray-600">
          Langfristige Cashflow-Projektion Ihrer Immobilie
        </p>
      </div>

      {/* Einstellungen */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Projektionsparameter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projektionszeitraum (Jahre)
            </label>
            <input
              type="number"
              className="input-field"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value) || 10)}
              min="1"
              max="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mietsteigerung pro Jahr (%)
            </label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={mietSteigerung}
              onChange={(e) => setMietSteigerung(parseFloat(e.target.value) || 2)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kostensteigerung pro Jahr (%)
            </label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={kostenSteigerung}
              onChange={(e) => setKostenSteigerung(parseFloat(e.target.value) || 2)}
            />
          </div>
        </div>
      </div>

      {/* Zusammenfassung */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Gesamter Cashflow ({years} Jahre)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalCashflow)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Durchschnitt pro Jahr
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averageYearlyCashflow)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`${totalCashflow >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-lg`}>
              {totalCashflow >= 0 ?
                <TrendingUp className="h-6 w-6 text-white" /> :
                <TrendingDown className="h-6 w-6 text-white" />
              }
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                ROI nach {years} Jahren
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {state.gesamtinvestition > 0
                  ? ((totalCashflow / state.gesamtinvestition) * 100).toFixed(1) + '%'
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cashflow-Tabelle */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jährliche Cashflow-Projektion
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jahr
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monatl. Miete
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operat. CF (J)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bankrate (J)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Netto-CF (J)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kumuliert
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projection.map((row) => (
                <tr key={row.year} className={row.year % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.year}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.monatlicheMiete)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.jahresOperativerCashflow >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                    {formatCurrency(row.jahresOperativerCashflow)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                    {formatCurrency(row.jahresBankrateGesamt)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.nettoCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {formatCurrency(row.nettoCashflow)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.kumuliert >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {formatCurrency(row.kumuliert)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break-Even Analyse */}
      {state.gesamtinvestition > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Break-Even Analyse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">
                Zeit bis zur Amortisation der Gesamtinvestition:
              </p>
              {(() => {
                const breakEvenYear = projection.findIndex(row => row.kumuliert >= state.gesamtinvestition)
                if (breakEvenYear === -1) {
                  return (
                    <p className="text-lg font-bold text-red-600">
                      Nicht innerhalb von {years} Jahren
                    </p>
                  )
                } else {
                  return (
                    <p className="text-lg font-bold text-green-600">
                      {breakEvenYear + 1} Jahre
                    </p>
                  )
                }
              })()}
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                Gesamtinvestition:
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(state.gesamtinvestition)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CashflowAnalysis