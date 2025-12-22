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
    let currentMiete = (parseFloat(state.nettokaltmiete) || 0) + (parseFloat(state.stellplatzmiete) || 0)
    let currentOperativ = parseFloat(state.nichtUmlagefaehigeKosten) || 0
    const jahresKapitaldienst = (state.monatlicherKapitaldienst || 0) * 12
    let kumuliert = 0

    for (let year = 1; year <= years; year++) {
      if (year > 1) {
        currentMiete *= (1 + mietSteigerung / 100)
        currentOperativ *= (1 + kostenSteigerung / 100)
      }

      const jahresmiete = currentMiete * 12
      const jahresOperativ = currentOperativ * 12
      // Cashflow = Miete - Operativ - Bank
      const nettoCashflow = jahresmiete - jahresOperativ - jahresKapitaldienst
      kumuliert += nettoCashflow

      data.push({
        year: `Jahr ${year}`,
        miete: Math.round(jahresmiete),
        operativ: Math.round(jahresOperativ),
        bank: Math.round(jahresKapitaldienst),
        totalKosten: Math.round(jahresOperativ + jahresKapitaldienst),
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
          Einnahmen vs Kosten (inkl. Finanzierung)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="miete" fill="#10b981" name="Mieteinnahmen" />
              <Bar dataKey="operativ" stackId="a" fill="#ea580c" name="Bewirtschaftung" />
              <Bar dataKey="bank" stackId="a" fill="#ef4444" name="Bankrate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kumulierter Cashflow */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kumulierter Cashflow über Zeit (nach Bank)
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
                name="Kumuliert"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cashflow"
                stroke="#10b981"
                strokeWidth={2}
                name="Jahres-Cashflow (Netto)"
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
                    name: 'Brutto',
                    wert: state.bruttomietrendite || 0,
                    fill: '#3b82f6'
                  },
                  {
                    name: 'Netto (Op.)',
                    wert: state.nettomietrendite || 0,
                    fill: '#8b5cf6'
                  },
                  {
                    name: 'EK-Rendite',
                    wert: state.eigenkapitalRendite || 0,
                    fill: '#10b981'
                  }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="wert" name="Rendite %">
                  {
                    [
                      { fill: '#3b82f6' },
                      { fill: '#8b5cf6' },
                      { fill: '#10b981' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts