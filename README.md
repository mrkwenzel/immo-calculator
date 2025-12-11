# Immobilien Kalkulator - Responsive Webapp

Eine moderne, responsive Webapp zur Berechnung und Analyse von Immobilien-Investitionen.

## Features

### 📊 Dashboard

- Übersicht aller wichtigen Kennzahlen
- Gesamtinvestition, Renditen und Cashflow auf einen Blick
- Schnellzugriff auf alle Funktionen

### 🧮 Investitionsrechner

- Eingabe von Kaufpreis und Wohnfläche
- Detaillierte Kaufnebenkosten (Makler, Notar, Grunderwerbssteuer, Sonstige)
- Mietdaten und Bewirtschaftungskosten
- Automatische Berechnung von:
  - Gesamtinvestition
  - Kaufpreis pro m²
  - Brutto- und Nettomietrendite
  - Monatlicher Cashflow
- Bewertung der Investition mit Ampelsystem

### 💰 Cashflow-Analyse

- Langfristige Cashflow-Projektion (1-30 Jahre)
- Berücksichtigung von Miet- und Kostensteigerungen
- Break-Even Analyse
- ROI-Berechnung
- Detaillierte Jahrestabelle

### 📈 Diagramme & Visualisierungen

- Jährliche Cashflow-Entwicklung (Balkendiagramm)
- Kumulierter Cashflow über Zeit (Liniendiagramm)
- Investitionskosten-Verteilung (Kreisdiagramm)
- Rendite-Vergleich mit Benchmarks
- Kennzahlen-Übersicht

## Technische Details

### Frontend-Stack

- **React 18** - Moderne UI-Bibliothek
- **Vite** - Schneller Build-Tool
- **Tailwind CSS** - Utility-first CSS Framework
- **Recharts** - Responsive Diagramm-Bibliothek
- **React Router** - Client-side Routing
- **Lucide React** - Moderne Icon-Bibliothek

### Responsive Design

- **Mobile First** - Optimiert für Smartphones
- **Tablet-freundlich** - Angepasste Layouts für Tablets
- **Desktop-optimiert** - Vollständige Funktionalität auf großen Bildschirmen
- **Touch-freundlich** - Große Buttons und einfache Navigation

### Features für Mobile

- Hamburger-Menü für Navigation
- Optimierte Eingabefelder
- Scrollbare Tabellen
- Responsive Diagramme
- Touch-optimierte Bedienung

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

Die Webapp läuft standardmäßig auf `http://localhost:3000`

## Verwendung

1. **Dashboard**: Überblick über alle Kennzahlen
2. **Investition**: Eingabe der Immobiliendaten
3. **Cashflow**: Langfristige Analyse und Projektion
4. **Diagramme**: Visualisierung der Daten

### Eingabefelder

**Grunddaten:**

- Kaufpreis in Euro
- Wohnfläche in m²

**Kaufnebenkosten:**

- Maklergebühren
- Notarkosten
- Grunderwerbssteuer
- Sonstige Kosten

**Mietdaten:**

- Nettokaltmiete pro Monat
- Bewirtschaftungskosten pro Monat

### Berechnungen

Die Webapp berechnet automatisch:

- **Gesamtinvestition** = Kaufpreis + Nebenkosten
- **Kaufpreis pro m²** = Kaufpreis / Wohnfläche
- **Bruttomietrendite** = (Jahresmiete / Gesamtinvestition) × 100
- **Nettomietrendite** = ((Jahresmiete - Jahreskosten) / Gesamtinvestition) × 100
- **Monatlicher Cashflow** = Nettokaltmiete - Bewirtschaftungskosten

## Browser-Kompatibilität

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile Browser (iOS Safari, Chrome Mobile)

## Projektstruktur

```text
src/
├── components/          # React Komponenten
│   ├── Navigation.jsx   # Hauptnavigation
│   ├── Dashboard.jsx    # Dashboard-Übersicht
│   ├── InvestmentCalculator.jsx  # Investitionsrechner
│   ├── CashflowAnalysis.jsx      # Cashflow-Analyse
│   └── Charts.jsx       # Diagramme
├── hooks/
│   └── useCalculation.jsx  # State Management
├── App.jsx             # Hauptkomponente
├── main.jsx           # Entry Point
└── index.css          # Globale Styles
```

## Weitere mögliche Anpassungen

Die Webapp kann einfach erweitert werden:

- Neue Berechnungsfelder hinzufügen
- Zusätzliche Diagrammtypen
- Export-Funktionen (PDF, Excel)
- Datenbank-Anbindung für Speicherung
- Mehrere Immobilien verwalten
