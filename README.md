# EthioFarm Web Portal — Enterprise Responsive Web Platform

### Enterprise Smart Agriculture Management System for All Devices (Desktops, Laptops, Tablets)

> [!NOTE]
> **Client Platform Separation**:
> - The native mobile smartphone application is built separately in Flutter (`agriEtech-frontend`).
> - `ethiofarm-web` is the dedicated **Enterprise Responsive Web Portal** for desktops, laptops, tablets, and large workstation displays.
> - Feature directories in `src/features/` have been initialized as **clean architectural scaffolding with zero mock code**, enabling each engineer to write production web features with zero merge conflicts.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Type-check & build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

The development server runs at `http://localhost:5173/`.

---

## 👥 Engineering Team Work Breakdown & Ownership

The system is partitioned into 3 isolated feature domains using Domain-Driven Modular Architecture (DDMA):

| Engineer | Feature Domain | Assigned Directory | Dedicated Specification | Git Working Branch |
| :--- | :--- | :--- | :--- | :--- |
| **Alen** | Farm Operations, GIS & IoT Ground Sensors | `src/features/farm-operations/` | [ALEN_TASK_SPECIFICATION.md](docs/ALEN_TASK_SPECIFICATION.md) | `feature/alen-farm-operations-and-sensors` |
| **Zinegnaw** | Crop AI, Plant Pathology & Camera Vision | `src/features/crop-pathology/` | [ZINEGNAW_TASK_SPECIFICATION.md](docs/ZINEGNAW_TASK_SPECIFICATION.md) | `feature/zinegnaw-crop-pathology-and-ai-vision` |
| **Banchamlak** | Planetary GIS, Weather, Hazards & Livestock | `src/features/weather-livestock/` | [BANCHAMLAK_TASK_SPECIFICATION.md](docs/BANCHAMLAK_TASK_SPECIFICATION.md) | `feature/banchamlak-weather-and-livestock` |

---

## 📚 Complete Documentation Suite

All project architecture, specifications, API contracts, and team conventions are documented in detail:

1. **[TEAM_ASSIGNMENTS.md](TEAM_ASSIGNMENTS.md)**: Master task allocation, domain responsibilities, and zero-conflict Git rules.
2. **[docs/ALEN_TASK_SPECIFICATION.md](docs/ALEN_TASK_SPECIFICATION.md)**: Alen's complete file manifest, data models (`Farm`, `SoilSensor`), endpoints, and acceptance criteria.
3. **[docs/ZINEGNAW_TASK_SPECIFICATION.md](docs/ZINEGNAW_TASK_SPECIFICATION.md)**: Zinegnaw's file manifest, Gemini AI disease contracts, leaf upload specs, and acceptance criteria.
4. **[docs/BANCHAMLAK_TASK_SPECIFICATION.md](docs/BANCHAMLAK_TASK_SPECIFICATION.md)**: Banchamlak's file manifest, weather/hazard models, livestock herd contracts, and acceptance criteria.
5. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Multi-device DDMA architecture, responsive layouts, networking layer, and token standards.
6. **[docs/API_INTEGRATION_GUIDE.md](docs/API_INTEGRATION_GUIDE.md)**: Backend REST endpoint inventory, response envelopes, JWT authentication, and network resilience.
7. **[docs/CODING_STANDARDS_AND_GITFLOW.md](docs/CODING_STANDARDS_AND_GITFLOW.md)**: TypeScript typing conventions, CSS token guidelines, GitFlow branching, and PR checklists.
8. **[docs/TEAM_SPECIFICATIONS.md](docs/TEAM_SPECIFICATIONS.md)**: 3-engineer consolidated functional specifications and data schemas.

---

## 🏛️ Project Directory Structure

```text
ethiofarm-web/
├── docs/                                  <-- Comprehensive Documentation Suite
│   ├── ALEN_TASK_SPECIFICATION.md         <-- Alen's detailed guide
│   ├── ZINEGNAW_TASK_SPECIFICATION.md     <-- Zinegnaw's detailed guide
│   ├── BANCHAMLAK_TASK_SPECIFICATION.md   <-- Banchamlak's detailed guide
│   ├── ARCHITECTURE.md                    <-- Enterprise web architecture
│   ├── TEAM_SPECIFICATIONS.md             <-- 3-engineer functional data models
│   ├── API_INTEGRATION_GUIDE.md           <-- Backend endpoints & JWT auth
│   └── CODING_STANDARDS_AND_GITFLOW.md    <-- TypeScript & Git conventions
├── src/
│   ├── features/                          <-- Isolated domain modules
│   │   ├── auth/                          <-- Shared IAM (Login, Registration, Password Recovery)
│   │   ├── farm-operations/               <-- ALEN (Farms, GIS & IoT Sensors)
│   │   ├── crop-pathology/                <-- ZINEGNAW (AI Vision & Diseases)
│   │   └── weather-livestock/             <-- BANCHAMLAK (Weather, Hazards & Livestock)
│   ├── components/layout/                 <-- Shared responsive layout (WebNavbar, WebFooter, WebLayout)
│   ├── context/                           <-- Global session & auth state
│   ├── services/                          <-- Axios HTTP client envelope (apiClient.ts)
│   ├── routes/                            <-- Central application routing
│   ├── App.tsx                            <-- Application root
│   └── main.tsx                           <-- Vite entry point
├── TEAM_ASSIGNMENTS.md                    <-- Master team allocation manifest
├── package.json                           <-- Dependencies & build scripts
└── vite.config.ts                         <-- Vite configuration
```

---

## 🛡️ Zero-Conflict Collaboration Rules

1. **Strict Folder Isolation**: Each engineer works strictly inside their assigned directory in `src/features/`.
2. **Never Touch Other Domains**: Never edit files in another developer's feature directory.
3. **Branch from `develop`**: All feature branches start from `develop` (`git checkout -b feature/<your-name>-<feature-slug>`).
4. **All PRs Target `develop`**: No direct commits to `main`. Every PR must pass `npm run build` with 0 errors.
