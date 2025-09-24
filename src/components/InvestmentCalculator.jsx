import React from 'react'
import { useCalculation } from '../hooks/useCalculation'
import { Save, Calculator } from 'lucide-react'
import NebenkostenPresets from './NebenkostenPresets'

const InvestmentCalculator = () => {
  const { state, updateField, updateNebenkosten, updateNebenkostenProzent, updateNebenkostenModus } = useCalculation()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value || 0)
  }

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    updateField(field, numValue)
  }

  const handleNebenkostenChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    updateNebenkosten(field, numValue)
  }

  const handleNebenkostenProzentChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    updateNebenkostenProzent(field, numValue)
  }

  const handleModusChange = (field, modus) => {
    updateNebenkostenModus(field, modus)
  }

  const getBerechneterWert = (field) => {
    return state.berechneteNebenkosten ? state.berechneteNebenkosten[field] || 0 : 0
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Investitionsrechner
        </h1>
        <p className="text-gray-600">
          Geben Sie die Details Ihrer Immobilien-Investition ein
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eingabeformular */}
        <div className="space-y-6">
          {/* Grunddaten */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="mr-2" size={20} />
              Grunddaten
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kaufpreis (€)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={state.kaufpreis || ''}
                  onChange={(e) => handleInputChange('kaufpreis', e.target.value)}
                  placeholder="z.B. 250000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wohnfläche (m²)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={state.wohnflaeche || ''}
                  onChange={(e) => handleInputChange('wohnflaeche', e.target.value)}
                  placeholder="z.B. 85"
                />
              </div>
            </div>
          </div>

          {/* Kaufnebenkosten */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Kaufnebenkosten
            </h3>
            <div className="space-y-6">
              {/* Makler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Makler
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    className="input-field sm:w-32"
                    value={state.nebenkostenModus.makler}
                    onChange={(e) => handleModusChange('makler', e.target.value)}
                  >
                    <option value="absolut">€</option>
                    <option value="prozent">%</option>
                  </select>
                  {state.nebenkostenModus.makler === 'absolut' ? (
                    <input
                      type="number"
                      className="input-field flex-1"
                      value={state.kaufnebenkosten.makler || ''}
                      onChange={(e) => handleNebenkostenChange('makler', e.target.value)}
                      placeholder="z.B. 8000"
                    />
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      className="input-field flex-1"
                      value={state.nebenkostenProzentual.makler || ''}
                      onChange={(e) => handleNebenkostenProzentChange('makler', e.target.value)}
                      placeholder="z.B. 3.57"
                    />
                  )}
                </div>
                {state.nebenkostenModus.makler === 'prozent' && (
                  <div className="text-sm text-gray-600 mt-1">
                    Berechnet: {formatCurrency(getBerechneterWert('makler'))}
                  </div>
                )}
              </div>

              {/* Notar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notar
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    className="input-field sm:w-32"
                    value={state.nebenkostenModus.notar}
                    onChange={(e) => handleModusChange('notar', e.target.value)}
                  >
                    <option value="absolut">€</option>
                    <option value="prozent">%</option>
                  </select>
                  {state.nebenkostenModus.notar === 'absolut' ? (
                    <input
                      type="number"
                      className="input-field flex-1"
                      value={state.kaufnebenkosten.notar || ''}
                      onChange={(e) => handleNebenkostenChange('notar', e.target.value)}
                      placeholder="z.B. 2500"
                    />
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      className="input-field flex-1"
                      value={state.nebenkostenProzentual.notar || ''}
                      onChange={(e) => handleNebenkostenProzentChange('notar', e.target.value)}
                      placeholder="z.B. 1.5"
                    />
                  )}
                </div>
                {state.nebenkostenModus.notar === 'prozent' && (
                  <div className="text-sm text-gray-600 mt-1">
                    Berechnet: {formatCurrency(getBerechneterWert('notar'))}
                  </div>
                )}
              </div>

              {/* Grunderwerbssteuer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grunderwerbssteuer
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    className="input-field sm:w-32"
                    value={state.nebenkostenModus.grunderwerbssteuer}
                    onChange={(e) => handleModusChange('grunderwerbssteuer', e.target.value)}
                  >
                    <option value="absolut">€</option>
                    <option value="prozent">%</option>
                  </select>
                  {state.nebenkostenModus.grunderwerbssteuer === 'absolut' ? (
                    <input
                      type="number"
                      className="input-field flex-1"
                      value={state.kaufnebenkosten.grunderwerbssteuer || ''}
                      onChange={(e) => handleNebenkostenChange('grunderwerbssteuer', e.target.value)}
                      placeholder="z.B. 15000"
                    />
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      className="input-field flex-1"
                      value={state.nebenkostenProzentual.grunderwerbssteuer || ''}
                      onChange={(e) => handleNebenkostenProzentChange('grunderwerbssteuer', e.target.value)}
                      placeholder="z.B. 6.0"
                    />
                  )}
                </div>
                {state.nebenkostenModus.grunderwerbssteuer === 'prozent' && (
                  <div className="text-sm text-gray-600 mt-1">
                    Berechnet: {formatCurrency(getBerechneterWert('grunderwerbssteuer'))}
                  </div>
                )}
              </div>

              {/* Sonstige */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sonstige Kosten
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    className="input-field sm:w-32"
                    value={state.nebenkostenModus.sonstige}
                    onChange={(e) => handleModusChange('sonstige', e.target.value)}
                  >
                    <option value="absolut">€</option>
                    <option value="prozent">%</option>
                  </select>
                  {state.nebenkostenModus.sonstige === 'absolut' ? (
                    <input
                      type="number"
                      className="input-field flex-1"
                      value={state.kaufnebenkosten.sonstige || ''}
                      onChange={(e) => handleNebenkostenChange('sonstige', e.target.value)}
                      placeholder="z.B. 1000"
                    />
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      className="input-field flex-1"
                      value={state.nebenkostenProzentual.sonstige || ''}
                      onChange={(e) => handleNebenkostenProzentChange('sonstige', e.target.value)}
                      placeholder="z.B. 0.5"
                    />
                  )}
                </div>
                {state.nebenkostenModus.sonstige === 'prozent' && (
                  <div className="text-sm text-gray-600 mt-1">
                    Berechnet: {formatCurrency(getBerechneterWert('sonstige'))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nebenkosten-Vorlagen */}
          <NebenkostenPresets />

          {/* Mietdaten */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mietdaten
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nettokaltmiete pro Monat (€)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={state.nettokaltmiete || ''}
                  onChange={(e) => handleInputChange('nettokaltmiete', e.target.value)}
                  placeholder="z.B. 800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bewirtschaftungskosten pro Monat (€)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={state.bewirtschaftungskosten || ''}
                  onChange={(e) => handleInputChange('bewirtschaftungskosten', e.target.value)}
                  placeholder="z.B. 150"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ergebnisse */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Berechnungsergebnisse
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Gesamtinvestition:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatCurrency(state.gesamtinvestition)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Kaufpreis + Nebenkosten
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Kaufpreis pro m²:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(state.kaufpreisProQm)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Bruttomietrendite:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {(state.bruttomietrendite || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Jahresmiete / Gesamtinvestition
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Nettomietrendite:</span>
                  <span className="text-xl font-bold text-purple-600">
                    {(state.nettomietrendite || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Nach Bewirtschaftungskosten
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Monatlicher Cashflow:</span>
                  <span className={`text-xl font-bold ${
                    state.monatlicheCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(state.monatlicheCashflow)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Miete - Bewirtschaftungskosten
                </div>
              </div>
            </div>
          </div>

          {/* Bewertung */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bewertung
            </h3>
            <div className="space-y-3">
              {state.bruttomietrendite >= 5 ? (
                <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Gute Bruttomietrendite ({state.bruttomietrendite.toFixed(2)}%)
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ⚠ Niedrige Bruttomietrendite ({state.bruttomietrendite.toFixed(2)}%)
                  </p>
                </div>
              )}

              {state.monatlicheCashflow >= 0 ? (
                <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Positiver Cashflow
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-800 font-medium">
                    ✗ Negativer Cashflow
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentCalculator