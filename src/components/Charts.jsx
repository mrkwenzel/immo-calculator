import React, { useState } from 'react'
import { useCalculation } from '../hooks/useCalculation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const Charts = () => {
  const { state } = useCalculation()
  const [years] = useState(10)
  const [mietSteigerung] = useState(2)
  const [kostenSteigerung] = useState(2)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value || 0)
  }

  // Cashflow-Daten für Diagramme
  const calculateChartData = () => {
    const data = []
    let currentMiete = state.nettokaltmiete
    let currentKosten = state.bewirtschaftungskosten
    let kumuliert = 0

    for (let year = 1; year <= years; year++) {
      if (year > 1) {
        currentMiete *= (1 + mietSteigerung / 100)
        currentKosten *= (1 + kostenSteigerung / 100)
      }

      const jahresmiete = currentMiete * 12
      const jahreskosten = currentKosten * 12
      const nettoCashflow = jahresmiete - jahreskosten
      kumuliert += nettoCashflow

      data.push({
        year: `Jahr ${year}`,
        miete: Math.round(jahresmiete),
        kosten: Math.round(jahreskosten),
        cashflow: Math.round(nettoCashflow),
        kumuliert: Math.round(kumuliert)
      })
    }

    return data
  }

  // Kostenverteilung für Pie Chart
  const kostenData = [
    { name: 'Kaufpreis', value: state.kaufpreis, color: '#3b82f6' },
    { name: 'Makler', value: state.kaufnebenkosten.makler, color: '#ef4444' },
    { name: 'Notar', value: state.kaufnebenkosten.notar, color: '#f59e0b' },
    { name: 'Grunderwerbssteuer', value: state.kaufnebenkosten.grunderwerbssteuer, color: '#10b981' },
    { name: 'Sonstige', value: state.kaufnebenkosten.sonstige, color: '#8b5cf6' }
  ].filter(item => item.value > 0)

  const chartData = calculateChartData()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Diagramme & Visualisierungen
        </h1>
        <p className="text-gray-600">
          Grafische Darstellung Ihrer Immobilien-Investition
        </p>
      </div>

      {/* Cashflow-Entwicklung */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jährliche Cashflow-Entwicklung
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="miete" fill="#10b981" name="Jahresmiete" />
              <Bar dataKey="kosten" fill="#ef4444" name="Jahreskosten" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kumulierter Cashflow */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kumulierter Cashflow über Zeit
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="kumuliert" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Kumulierter Cashflow"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="cashflow" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Jährlicher Cashflow"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kostenverteilung */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Investitionskosten-Verteilung
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kostenData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {kostenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rendite-Vergleich */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rendite-Kennzahlen
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Bruttomietrendite',
                    wert: state.bruttomietrendite || 0,
                    benchmark: 5
                  },
                  {
                    name: 'Nettomietrendite',
                    wert: state.nettomietrendite || 0,
                    benchmark: 3
                  }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="wert" fill="#3b82f6" name="Ihre Rendite" />
                <Bar dataKey="benchmark" fill="#94a3b8" name="Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Kennzahlen-Übersicht */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Wichtige Kennzahlen im Überblick
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(state.gesamtinvestition)}
            </div>
            <div className="text-sm text-gray-600">Gesamtinvestition</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(state.bruttomietrendite || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Bruttomietrendite</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(state.monatlicheCashflow)}
            </div>
            <div className="text-sm text-gray-600">Monatlicher Cashflow</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(state.kaufpreisProQm)}
            </div>
            <div className="text-sm text-gray-600">Preis pro m²</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts