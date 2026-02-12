## CareOps

CareOps is a React + TypeScript single-page app built with Vite and Tailwind CSS.
It provides a simple onboarding flow for healthcare businesses and a basic dashboard that visualizes leads, bookings, and forms using a shared context.

### Tech stack

- **React 19** with **TypeScript**
- **Vite** for bundling and dev server
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **ESLint** + **TypeScript ESLint** for linting

### Getting started

1. **Install dependencies**

```bash
npm install
```

2. **Run the dev server**

```bash
npm run dev
```

3. Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

### Available scripts

- **`npm run dev`** – start the Vite dev server
- **`npm run build`** – type-check and create a production build
- **`npm run preview`** – preview the production build locally
- **`npm run lint`** – run ESLint on the project

### Project structure (high level)

- `src/main.tsx` – React entry point
- `src/App.tsx` – app routing and layout shell
- `src/context/CareOpsContext.tsx` – shared state for business, leads, bookings, forms, and messages
- `src/pages/Onboarding.tsx` – onboarding form to capture business details
- `src/pages/Dashboard.tsx` – dashboard showing basic stats and placeholder messaging area
