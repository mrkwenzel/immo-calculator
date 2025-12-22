import React from 'react'
import { useCalculation } from '../hooks/useCalculation'

const NebenkostenPresets = () => {
  const { updateNebenkostenProzent, updateNebenkostenModus } = useCalculation()

  const presets = [
    { name: 'Baden-Württemberg', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.0, sonstige: 0.5 } },
    { name: 'Bayern', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 3.5, sonstige: 0.5 } },
    { name: 'Berlin', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.0, sonstige: 0.5 } },
    { name: 'Brandenburg', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.5, sonstige: 0.5 } },
    { name: 'Bremen', values: { makler: 2.98, notar: 1.5, grunderwerbssteuer: 5.0, sonstige: 0.5 } },
    { name: 'Hamburg', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.5, sonstige: 0.5 } },
    { name: 'Hessen', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.0, sonstige: 0.5 } },
    { name: 'Meckl.-Vorpommern', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.0, sonstige: 0.5 } },
    { name: 'Niedersachsen', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.0, sonstige: 0.5 } },
    { name: 'NRW', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.5, sonstige: 0.5 } },
    { name: 'Rheinland-Pfalz', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.0, sonstige: 0.5 } },
    { name: 'Saarland', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.5, sonstige: 0.5 } },
    { name: 'Sachsen', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.5, sonstige: 0.5 } },
    { name: 'Sachsen-Anhalt', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.0, sonstige: 0.5 } },
    { name: 'Schleswig-Holstein', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 6.5, sonstige: 0.5 } },
    { name: 'Thüringen', values: { makler: 3.57, notar: 1.5, grunderwerbssteuer: 5.0, sonstige: 0.5 } }
  ]

  const applyPreset = (preset) => {
    // Alle auf Prozent umstellen
    Object.keys(preset.values).forEach(field => {
      updateNebenkostenModus(field, 'prozent')
      updateNebenkostenProzent(field, preset.values[field])
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Nebenkosten-Vorlagen
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Schnell typische Nebenkosten für verschiedene Bundesländer anwenden:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => applyPreset(preset)}
            className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
          >
            <div className="font-medium text-gray-900 text-sm">{preset.name}</div>
            <div className="text-xs text-gray-500 mt-2">
              Gesamt: {Object.values(preset.values).reduce((sum, val) => sum + val, 0).toFixed(1)}%
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default NebenkostenPresets