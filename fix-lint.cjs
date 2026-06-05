const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to fix
const files = [
  'src/App.jsx',
  'src/components/CashflowAnalysis.jsx',
  'src/components/Charts.jsx',
  'src/components/Dashboard.jsx',
  'src/components/FinancingPage.jsx',
  'src/components/InvestmentPage.jsx',
  'src/components/Navigation.jsx',
  'src/components/NebenkostenPresets.jsx',
  'src/components/RentPage.jsx',
  'src/components/investment/AncillaryCostsForm.jsx',
  'src/components/investment/BasicDataForm.jsx',
  'src/components/investment/DualModeInput.jsx',
  'src/components/investment/FinancingForm.jsx',
  'src/components/investment/InvestmentRating.jsx',
  'src/components/investment/RentalDataForm.jsx',
  'src/components/investment/ResultsDisplay.jsx',
  'src/hooks/useCalculation.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove `React, ` or `React` from imports
  content = content.replace(/import React, \{/g, 'import {');
  content = content.replace(/import React from 'react'[\r\n]*/g, '');
  content = content.replace(/import React from "react"[\r\n]*/g, '');
  
  fs.writeFileSync(filePath, content);
});

// App.jsx: remove unused useState
let appContent = fs.readFileSync(path.join(__dirname, 'src/App.jsx'), 'utf8');
appContent = appContent.replace(/import \{ useState \} from 'react'[\r\n]*/, '');
fs.writeFileSync(path.join(__dirname, 'src/App.jsx'), appContent);

// FinancingForm.jsx: remove isOptional
let finFormContent = fs.readFileSync(path.join(__dirname, 'src/components/investment/FinancingForm.jsx'), 'utf8');
finFormContent = finFormContent.replace(/const isOptional = loan\.includeInCashflow !== undefined/g, '');
fs.writeFileSync(path.join(__dirname, 'src/components/investment/FinancingForm.jsx'), finFormContent);

// RentalDataForm.jsx: remove hausgeldQuote
let rentFormContent = fs.readFileSync(path.join(__dirname, 'src/components/investment/RentalDataForm.jsx'), 'utf8');
rentFormContent = rentFormContent.replace(/const hausgeldQuote = [^\n]*\n/g, '');
fs.writeFileSync(path.join(__dirname, 'src/components/investment/RentalDataForm.jsx'), rentFormContent);

// ResultsDisplay.jsx: remove TrendingUp
let resultsContent = fs.readFileSync(path.join(__dirname, 'src/components/investment/ResultsDisplay.jsx'), 'utf8');
resultsContent = resultsContent.replace(/import \{ Landmark, TrendingUp \} from 'lucide-react'/, "import { Landmark } from 'lucide-react'");
fs.writeFileSync(path.join(__dirname, 'src/components/investment/ResultsDisplay.jsx'), resultsContent);

// useCalculation.jsx: add eslint-disable for fast refresh
let useCalcContent = fs.readFileSync(path.join(__dirname, 'src/hooks/useCalculation.jsx'), 'utf8');
if (!useCalcContent.includes('eslint-disable react-refresh')) {
  useCalcContent = '/* eslint-disable react-refresh/only-export-components */\n' + useCalcContent;
  fs.writeFileSync(path.join(__dirname, 'src/hooks/useCalculation.jsx'), useCalcContent);
}

// useLocalStorage.jsx: remove useEffect
let useLocalContent = fs.readFileSync(path.join(__dirname, 'src/hooks/useLocalStorage.jsx'), 'utf8');
useLocalContent = useLocalContent.replace(/import \{ useState, useEffect \} from 'react'/, "import { useState } from 'react'");
fs.writeFileSync(path.join(__dirname, 'src/hooks/useLocalStorage.jsx'), useLocalContent);

console.log('Lint fixes applied.');
