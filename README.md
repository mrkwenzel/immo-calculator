# Immobilien Kalkulator - Responsive Webapp

Eine moderne, responsive Webapp zur Berechnung und Analyse von Immobilien-Investitionen.

## Features

### 📊 Dashboard

- Übersicht aller wichtigen Kennzahlen: Gesamtinvestition, Kaufpreis pro m², Bruttomietrendite, monatlicher Cashflow
- Investitions- und Renditeübersicht auf einen Blick
- Persistente Datenspeicherung via LocalStorage (automatisch, 500 ms debounced)
- Daten zurücksetzen Funktion

### 🏠 Investitionsdaten

- Eingabe von Kaufpreis und Wohnfläche
- Detaillierte Kaufnebenkosten (Makler, Notar, Grunderwerbssteuer, Sonstige)
- Dual-Modus-Eingabe je Nebenkostenfeld: Absolut (€) oder Prozent (%) des Kaufpreises
- Vorlagen-Schnellwahl für typische Nebenkostenkombinationen (NebenkostenPresets)
- Automatische Berechnung von Gesamtinvestition und Kaufpreis pro m²

### 🏘️ Mietdaten & Hausgeld

- Nettokaltmiete und Stellplatzmiete (separat)
- Hausgeld aufgeteilt in umlagefähige und nicht-umlagefähige Kosten
- Kennzahlen: Brutto- und Nettomietrendite, Hausgeld-Quote
- Ampel-Bewertung der Investitionsqualität inkl. Hausgeld-Verteilung

### 💳 Finanzierung

- Bis zu 3 separate Darlehen konfigurierbar
- Pro Darlehen: Darlehensbetrag (absolut oder % des Kaufpreises), Zinssatz, Tilgung
- Cashflow-Toggle je Darlehen: optionale Ein-/Ausblendung aus der Cashflow-Rechnung
- Automatische Berechnung von:
  - Monatliche Rate (Annuität) je Darlehen
  - Gesamtkapitaldienst (alle Darlehen)
  - Eigenkapital und Eigenkapital-Rendite (EK-Rendite) mit Hebel-Bewertung
  - Cashflow nach Bank (nur relevante Darlehen)

### 💰 Cashflow-Analyse

- Langfristige Cashflow-Projektion (1–30 Jahre)
- Konfigurierbare Miet- und Kostensteigerung pro Jahr
- Zusammenfassungskacheln: kumulierter Cashflow, durchschnittlicher Jahres-Cashflow, ROI
- Detaillierte Jahrestabelle mit operativem Cashflow, Bankrate und kumuliertem Cashflow
- Break-Even-Analyse (Jahr der Amortisation der Gesamtinvestition)

### 📈 Diagramme & Visualisierungen

- Balkendiagramm: Einnahmen vs. Kosten inkl. Finanzierung (gestapelt, jährlich)
- Liniendiagramm: Kumulierter Cashflow nach Bank über Zeit
- Kreisdiagramm: Investitionskosten-Verteilung (Kaufpreis + Nebenkosten)
- Balkendiagramm: Rendite-Vergleich (Brutto, Netto, EK-Rendite)

---

## Technische Details

### Frontend-Stack

| Technologie | Version | Zweck |
|---|---|---|
| React | 19 | UI-Bibliothek |
| Vite | 8 | Build-Tool & Dev-Server |
| Tailwind CSS | 4 | Utility-first CSS Framework |
| Recharts | 3 | Responsive Diagramm-Bibliothek |
| React Router | 7 | Client-side Routing |
| Lucide React | 1 | Icon-Bibliothek |

### Responsive Design

- **Mobile First** – optimiert für Smartphones
- **Tablet-freundlich** – angepasste Layouts
- **Desktop-optimiert** – vollständige Funktionalität auf großen Bildschirmen

### ✅ Tests & Qualitätssicherung

- **Vitest** – schnelles Testing-Framework (mit Coverage)
- **React Testing Library** – Component Testing
- 100 % Abdeckung aller Berechnungs- und Validierungs-Utilities
- Automatische Tests im Docker-Build-Prozess (fail-on-error)

---

## Architektur

### Projektstruktur

```
src/
├── components/
│   ├── shared/
│   │   └── forms/
│   │       ├── InputField.jsx        # Generisches Eingabefeld
│   │       └── DualModeInput.jsx     # Absolut/Prozent-Umschalter
│   ├── investment/
│   │   ├── InvestmentContainer.jsx   # Zustand & Logik
│   │   ├── InvestmentPresentational.jsx
│   │   ├── BasicDataForm.jsx
│   │   ├── AncillaryCostsForm.jsx
│   │   ├── RentalDataForm.jsx
│   │   ├── FinancingForm.jsx
│   │   ├── ResultsDisplay.jsx
│   │   └── InvestmentRating.jsx
│   ├── financing/
│   │   ├── FinancingContainer.jsx
│   │   └── FinancingPresentational.jsx
│   ├── cashflow/
│   │   ├── CashflowContainer.jsx
│   │   └── CashflowPresentational.jsx
│   ├── Navigation.jsx
│   ├── Dashboard.jsx
│   ├── NebenkostenPresets.jsx
│   ├── InvestmentPage.jsx
│   ├── RentPage.jsx
│   ├── FinancingPage.jsx
│   ├── CashflowAnalysis.jsx
│   └── Charts.jsx
├── hooks/
│   ├── useCalculation.jsx            # Context, Reducer, LocalStorage
│   └── useLocalStorage.jsx
├── utils/
│   ├── calculations/
│   │   ├── index.js                  # Orchestrator: calculateDerivedValues()
│   │   ├── investment.js             # Gesamtinvestition, Renditen
│   │   ├── financing.js              # Annuitäten, EK-Rendite
│   │   └── cashflow.js               # Operativer & netto Cashflow
│   ├── cashflowProjection.js         # Langfrist-Projektion
│   ├── formatters.js                 # Währungs- & Prozentformatierung
│   └── validation.js                 # Eingabevalidierung
├── App.jsx                           # Routing & Provider
├── main.jsx
└── index.css
```

### Berechnungslogik

```
useCalculation (Reducer)
  └── calculateDerivedValues (calculations/index.js)
        ├── calculateInvestment()   → Gesamtinvestition, Renditen
        ├── calculateFinancing()   → Annuitäten, EK-Rendite
        └── calculateCashflow()    → Cashflow nach Bank
```

Kernformeln:

| Kennzahl | Formel |
|---|---|
| Gesamtinvestition | Kaufpreis + Kaufnebenkosten |
| Hausgeld | Umlagefähig + Nicht-umlagefähig |
| Operativer Cashflow | Gesamtmiete − Nicht-umlagefähiges Hausgeld |
| Cashflow nach Bank | Operativer Cashflow − Kapitaldienstrate (relevante Darlehen) |
| Bruttomietrendite | (Jahresmiete / Gesamtinvestition) × 100 |
| Nettomietrendite | (Jahresmiete − Jahreskosten) / Gesamtinvestition × 100 |
| EK-Rendite | (Cashflow nach Bank × 12 / Eigenkapital) × 100 |

---

## Installation & Start

```bash
# Dependencies installieren
npm install

# Development Server starten (http://localhost:5173)
npm run dev

# Tests ausführen
npm test

# Test-Coverage
npm run test:coverage

# Für Produktion bauen
npm run build

# Preview der Production Build
npm run preview
```

## Docker

```bash
# Image bauen
docker build -t immo-calculator .

# Container starten (Port 8080)
docker run -p 8080:8080 immo-calculator
```

Die App ist dann erreichbar unter `http://localhost:8080`.

---

## Verwendung

1. **Investition** – Kaufpreis, Wohnfläche und Kaufnebenkosten eingeben
2. **Miete** – Nettokaltmiete, Stellplatz und Hausgeld erfassen
3. **Finanzierung** – bis zu 3 Darlehen konfigurieren
4. **Cashflow** – Projektionszeitraum und Steigerungsraten einstellen, Jahrestabelle analysieren
5. **Diagramme** – grafische Auswertung aller Kennzahlen
