# Change Risk Simulator – Frontend

React + TypeScript frontend with **React Flow** for dependency graph visualization.

## Run locally

1. Start the backend (from repo root):
   ```bash
   dotnet run --project ChangeRiskSimulator
   ```
   The API runs at `http://localhost:5094`.

2. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```
   The app runs at `http://localhost:5173`. The Vite dev server proxies `/api` to the backend.

## Features

- **Simulate Change** form: choose resource, change type, region, environment.
- **Risk summary**: risk level badge, score, impacted resource count.
- **Risk signals**: list of risk factors and explanations.
- **Dependency graph**: interactive graph with:
  - Resource nodes (VM, app, database) and icons
  - Red = impacted by the change, grey = unaffected
  - Animated edges between impacted nodes
  - Pan, zoom, and fit-to-view controls
