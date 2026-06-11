import { useState, useMemo } from 'react'
import { useCalculation } from '../../hooks/useCalculation'
import { calculateCashflowProjection } from '../../utils/cashflowProjection'
import { CashflowTable, CashflowSummaryCards } from './CashflowPresentational'

const CashflowContainer = () => {
    const { state } = useCalculation()
    const [years, setYears] = useState(10)
    const [mietSteigerung, setMietSteigerung] = useState(2)
    const [kostenSteigerung, setKostenSteigerung] = useState(2)

    const projection = useMemo(() =>
        calculateCashflowProjection(state, years, mietSteigerung, kostenSteigerung),
        [state, years, mietSteigerung, kostenSteigerung])

    const totalCashflow = projection[projection.length - 1]?.kumuliert || 0
    const averageYearlyCashflow = totalCashflow / years

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow-Analyse</h1>
                <p className="text-gray-600">Langfristige Cashflow-Projektion Ihrer Immobilie</p>
            </div>

            {/* Einstellungen */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Projektionsparameter</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Projektionszeitraum (Jahre)</label>
                        <input type="number" className="input-field" value={years}
                            onChange={(e) => setYears(parseInt(e.target.value) || 10)} min="1" max="30" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mietsteigerung pro Jahr (%)</label>
                        <input type="number" step="0.1" className="input-field" value={mietSteigerung}
                            onChange={(e) => setMietSteigerung(parseFloat(e.target.value) || 2)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kostensteigerung pro Jahr (%)</label>
                        <input type="number" step="0.1" className="input-field" value={kostenSteigerung}
                            onChange={(e) => setKostenSteigerung(parseFloat(e.target.value) || 2)} />
                    </div>
                </div>
            </div>

            <CashflowSummaryCards
                totalCashflow={totalCashflow}
                averageYearlyCashflow={averageYearlyCashflow}
                years={years}
                gesamtinvestition={state.gesamtinvestition}
            />

            <CashflowTable projection={projection} />

            {/* Break-Even Analyse */}
            {state.gesamtinvestition > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Break-Even Analyse</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 mb-2">Zeit bis zur Amortisation der Gesamtinvestition:</p>
                            {(() => {
                                const breakEvenYear = projection.findIndex(row => row.kumuliert >= state.gesamtinvestition)
                                return breakEvenYear === -1
                                    ? <p className="text-lg font-bold text-red-600">Nicht innerhalb von {years} Jahren</p>
                                    : <p className="text-lg font-bold text-green-600">{breakEvenYear + 1} Jahre</p>
                            })()}
                        </div>
                        <div>
                            <p className="text-gray-600 mb-2">Gesamtinvestition:</p>
                            <p className="text-lg font-bold text-gray-900">
                                {state.gesamtinvestition.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CashflowContainer
