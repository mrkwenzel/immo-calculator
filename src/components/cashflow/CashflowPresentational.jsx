import { formatCurrency } from '../../utils/formatters'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

const CashflowTable = ({ projection }) => (
    <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Jährliche Cashflow-Projektion
        </h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jahr</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monatl. Miete</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operat. CF (J)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bankrate (J)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Netto-CF (J)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kumuliert</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {projection.map((row) => (
                        <tr key={row.year} className={row.year % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.yearLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.monatlicheMiete)}</td>
                            <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.jahresOperativerCashflow >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                {formatCurrency(row.jahresOperativerCashflow)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{formatCurrency(row.jahresBankrateGesamt)}</td>
                            <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.nettoCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(row.nettoCashflow)}
                            </td>
                            <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.kumuliert >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(row.kumuliert)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

const CashflowSummaryCards = ({ totalCashflow, averageYearlyCashflow, years, gesamtinvestition }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
            <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Gesamter Cashflow ({years} Jahre)</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCashflow)}</p>
                </div>
            </div>
        </div>
        <div className="card">
            <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Durchschnitt pro Jahr</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageYearlyCashflow)}</p>
                </div>
            </div>
        </div>
        <div className="card">
            <div className="flex items-center">
                <div className={`${totalCashflow >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-lg`}>
                    {totalCashflow >= 0
                        ? <TrendingUp className="h-6 w-6 text-white" />
                        : <TrendingDown className="h-6 w-6 text-white" />
                    }
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">ROI nach {years} Jahren</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {gesamtinvestition > 0
                            ? ((totalCashflow / gesamtinvestition) * 100).toFixed(1) + '%'
                            : '0%'
                        }
                    </p>
                </div>
            </div>
        </div>
    </div>
)

const CashflowSincePossessionCard = ({ totalCashflow, elapsedMonths }) => (
    <div className="card">
        <div className="flex items-center">
            <div className={`${totalCashflow >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-lg`}>
                <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cashflow seit Besitzübergang</p>
                <p className={`text-2xl font-bold ${totalCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalCashflow)}
                </p>
                <p className="text-xs text-gray-500">{elapsedMonths} Monate</p>
            </div>
        </div>
    </div>
)

export { CashflowTable, CashflowSummaryCards, CashflowSincePossessionCard }
