# daily-planner

Daily Planner, ein Projekt von Robert Ackermann. Made with ♥ and ☕ in Leipzig.

## Vorraussetzungen

Folgende Anwendungen müssen auf dem System installiert sein:

-   [Node.js](https://nodejs.org/)
-   [Go](https://golang.org/)

## Installation

Repository klonen:

```bash
git clone https://github.com/batzlov/daily-planner.git
cd daily-planner
```

### Frontend

```bash
cd frontend
cp .env.example .env.local # Datei entsprechend dem System anpassen
npm install
npm run dev
```

### Backend

```bash
cd backend
cp .env.example .env # Datei entsprechend dem System anpassen
go build -o /bin/daily-planner-api
./bin/daily-planner-api
```

## Allgemeines

Das Skript zum erstellen der Datenbank findet sich unter `docs/database/daily-planner.sql`. Die Datenbank muss vorher nicht erstellt werden, da das Skript dies automatisch erledigt. Einfach nur das Skript importieren und starten. Eine Dokumentation der API findet sich unter `docs/api-documentation.md`.
