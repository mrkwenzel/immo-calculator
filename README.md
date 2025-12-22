# Immobilien Kalkulator - Responsive Webapp

Eine moderne, responsive Webapp zur Berechnung und Analyse von Immobilien-Investitionen.

## Features

### 📊 Dashboard

- Übersicht aller wichtigen Kennzahlen
- Gesamtinvestition, Renditen und Cashflow auf einen Blick
- Schnellzugriff auf alle Funktionen
- **NEU**: Persistente Datenspeicherung (LocalStorage)
- **NEU**: Daten zurücksetzen Funktion

### ✨ Eingabe & Validierung

- Echtzeit-Validierung aller Eingaben
- Warnung bei unrealistischen Werten
- Flexible Eingabe: Absolut (€) oder Prozent (%)
- Übersichtliche Fehlermeldungen

### 🧮 Investitionsrechner

- Eingabe von Kaufpreis und Wohnfläche
- Detaillierte Kaufnebenkosten (Makler, Notar, Grunderwerbssteuer, Sonstige)
- **Mietdaten & Hausgeld**:
  - Trennung in umlagefähige und nicht-umlagefähige Kosten
  - Berücksichtigung von Stellplatzmiete
- Automatische Berechnung von:
  - Gesamtinvestition
  - Kaufpreis pro m²
  - Brutto- und Nettomietrendite
- Bewertung der Investition mit Ampelsystem

### 💳 Finanzierung (NEU)

- Unterstützung für bis zu **3 separate Darlehen**
- Einstellung von Zinssatz und Tilgung pro Darlehen
- Automatische Berechnung von:
  - Monatlicher Kapitaldienst (Zins + Tilgung)
  - Darlehenssumme gesamt
  - Cashflow nach Bank (Netto-Netto)
  - **Eigenkapital-Rendite (EK-Rendite)**

### 💰 Cashflow-Analyse

- Langfristige Cashflow-Projektion (1-30 Jahre)
- Berücksichtigung von Miet- und Kostensteigerungen
- **Integration der Finanzierung** in die Projektion
- Break-Even Analyse (Amortisation nach Bank)
- ROI-Berechnung
- Detaillierte Jahrestabelle

### 📈 Diagramme & Visualisierungen

- Jährliche Cashflow-Entwicklung (Stacked: Miete vs. Operativ vs. Bank)
- Kumulierter Cashflow über Zeit (nach Bankrate)
- Investitionskosten-Verteilung (Kreisdiagramm)
- Rendite-Vergleich (Brutto vs. Netto vs. EK-Rendite)
- Kennzahlen-Übersicht

## Technische Details

### Frontend-Stack

- **React 18** - Moderne UI-Bibliothek
- **Vite** - Schneller Build-Tool
- **Tailwind CSS** - Utility-first CSS Framework (Custom Design System)
- **Recharts** - Responsive Diagramm-Bibliothek
- **React Router** - Client-side Routing
- **Lucide React** - Moderne Icon-Bibliothek

### Responsive Design

- **Mobile First** - Optimiert für Smartphones
- **Tablet-freundlich** - Angepasste Layouts für Tablets
- **Desktop-optimiert** - Vollständige Funktionalität auf großen Bildschirmen
- **Touch-freundlich** - Große Buttons und einfache Navigation

### ✅ Tests & Qualitätssicherung

- **Vitest** - Schnelles Testing-Framework
- **React Testing Library** - Component Testing
- **Automatische Tests** im Docker-Build-Prozess (fail-on-error)

## Installation & Start (lokal)

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Für Produktion bauen
npm run build

# Preview der Production Build
npm run preview
```

## Docker Image bauen

Folgendes Kommando aufrufen:

```bash
docker build -t immo-calculator .
```

## Container starten

```bash
docker run -p 8080:80 immo-calculator
```

## App aufrufen

Die Webapp läuft standardmäßig auf `http://localhost:8080` (Docker) oder Port 5173 (lokal)

## Verwendung

1. **Investition**: Eingabe der Grunddaten und Kaufnebenkosten
2. **Miete**: Verwaltung der Einnahmen und Hausgeld-Struktur
3. **Finanzierung**: Konfiguration der Bankdarlehen
4. **Cashflow**: Langfristige Analyse der Rentabilität
5. **Diagramme**: Grafische Auswertung der Ergebnisse

### Berechnungen

Die Webapp berechnet automatisch:

- **Gesamtinvestition** = Kaufpreis + Nebenkosten
- **Hausgeld** = Umlagefähig + Nicht-umlagefähig
- **Operativer Cashflow** = Gesamtmiete - nicht-umlagefähige Kosten
- **Cashflow nach Bank** = Operativer Cashflow - Kapitaldienst
- **Bruttomietrendite** = (Jahresmiete / Gesamtinvestition) × 100
- **Eigenkapital-Rendite** = ((Monatlicher Cashflow nach Bank × 12) / Eigenkapital) × 100

## Projektstruktur

```
src/
├── components/          # React Komponenten
│   ├── investment/      # Formulare & Anzeigen
│   │   ├── BasicDataForm.jsx
│   │   ├── AncillaryCostsForm.jsx
│   │   ├── RentalDataForm.jsx
│   │   ├── FinancingForm.jsx
│   │   ├── ResultsDisplay.jsx
│   │   └── InvestmentRating.jsx
│   ├── Navigation.jsx   # Hauptnavigation
│   ├── Dashboard.jsx    # Dashboard-Übersicht
│   ├── InvestmentPage.jsx # Seite Investition
│   ├── RentPage.jsx       # Seite Miete
│   ├── FinancingPage.jsx  # Seite Finanzierung
│   ├── CashflowAnalysis.jsx # Cashflow-Analyse
│   ├── Charts.jsx       # Diagramme
│   └── InputField.jsx   # Wiederverwendbare Eingabekomponente
├── hooks/
│   ├── useCalculation.jsx  # State Management & Berechnung
│   └── useLocalStorage.jsx # Daten-Persistenz
├── utils/
│   └── validation.js    # Validierungslogik
├── App.jsx             # Routing & Providers
├── main.jsx           # Entry Point
└── index.css          # Styles
```

## Weitere mögliche Anpassungen

Die Webapp kann einfach erweitert werden:

- Neue Berechnungsfelder hinzufügen
- Zusätzliche Diagrammtypen
- Export-Funktionen (PDF, Excel)
- Datenbank-Anbindung für Speicherung
- Mehrere Immobilien verwalten
