import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import InvestmentCalculator from './components/InvestmentCalculator'
import CashflowAnalysis from './components/CashflowAnalysis'
import Charts from './components/Charts'
import { CalculationProvider } from './hooks/useCalculation'

function App() {
  return (
    <CalculationProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/investment" element={<InvestmentCalculator />} />
              <Route path="/cashflow" element={<CashflowAnalysis />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CalculationProvider>
  )
}

export default App