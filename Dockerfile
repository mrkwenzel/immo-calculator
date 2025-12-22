# --- Stage 1: Build ---
# Wir verwenden das aktuelle Node 22 Image (LTS)
FROM node:22-alpine as builder

# Arbeitsverzeichnis im Container setzen
WORKDIR /app

# Kopiere zuerst nur die package-Dateien (für besseres Caching von Docker)
COPY package*.json ./

# Installiere die Abhängigkeiten (verbose für mehr Output bei Fehlern, no-audit für Speed)
RUN npm install --verbose

# Kopiere den Rest des Projektcodes
COPY . .

# Setze CI Environment Variable damit Vitest nicht im Watch-Mode läuft
ENV CI=true

# Führe Tests aus (run flag erzwingt einmaligen Durchlauf) und zeige Fehler an
RUN npm test -- run

# Baue die App für die Produktion (erstellt den /dist Ordner)
RUN npm run build

# --- Stage 2: Serve ---
# Wir verwenden einen leichten Nginx-Server für die Auslieferung
FROM nginx:alpine

# Kopiere die gebauten Dateien aus Stage 1 in das Nginx-Verzeichnis
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopiere die Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 freigeben
EXPOSE 80

# Nginx im Vordergrund starten
CMD ["nginx", "-g", "daemon off;"]