# 🌾 Yadu AI — Smart Farming Assistant (Frontend)

A frontend-only React app for Yadu AI, an AI-powered farming assistant for Indian
farmers. Built with mock data and a clean API service layer so a backend team
can wire up real endpoints without touching any UI code.

## Stack

- React 18 + Vite
- React Router
- Tailwind CSS
- Recharts (health trend, temperature, price charts)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

Log in or register with **any** values — authentication is mocked, so any
mobile number and password will work.

## Project structure

```
src/
  components/     Reusable UI: cards, layout, chat, forms, gauges…
  pages/          One file per route (Landing, Dashboard, Crops, …)
  context/        FarmerContext — auth + profile state
  data/mockData.js  ALL mock data lives here (single source of truth)
  services/api.js   API abstraction — swap the body of each function
                     to call a real endpoint; components never change.
  utils/          Small shared helpers (e.g. weather icon mapping)
```

## Connecting a real backend

Every function in `src/services/api.js` is documented with the REST endpoint
it should eventually call, e.g.:

```js
/** GET /api/weather?location= */
export async function getWeather() { ... }
```

Replace the mock body with a real `fetch`/`axios` call that returns data in
the same shape, and no component needs to change.

## Design notes

- Palette, typography and the "growth ring" health gauge are defined once in
  `tailwind.config.js` / `src/index.css` / `HealthScore.jsx` and reused
  everywhere a health score appears (crop health, soil health).
- Fully responsive: sidebar → hamburger + bottom tab bar on mobile.
- Loading, empty, and error states are implemented for every data-driven
  screen (`LoadingAnimation.jsx`, `EmptyState.jsx`, `ErrorState.jsx`).
