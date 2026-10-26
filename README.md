# EthioFarm Web Portal — Enterprise Responsive Web Platform

### Enterprise Smart Agriculture Management System for All Devices (Desktops, Laptops, Tablets)

> [!NOTE]
> **Client Platform Separation**:
> - The native mobile smartphone application is built separately in Flutter (`agriEtech-frontend`).
> - `ethiofarm-web` is the dedicated **Enterprise Responsive Web Portal** engineered for desktops, laptops, tablets, and workstation displays.
> - Built with TypeScript, React 19, and Vite, featuring Domain-Driven Modular Architecture (DDMA) with role-based routing and automated Bearer JWT API integration.

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

The system is partitioned across feature domains using Domain-Driven Modular Architecture (DDMA). **Abraham Amogne** serves as the **Team Leader & Full-Stack System Architect**.

| Engineer | Student ID | Formal Engineering Role | Assigned Feature Domain & Deliverables in Web Portal | Core Directories & Modules |
| :--- | :--- | :--- | :--- | :--- |
| **Abraham Amogne** | `CTC-329-26` | **Team Leader · System Architect** | **Enterprise Architecture, Core Shell & IAM Security**: Scaffolding, React 19 + TypeScript architecture, responsive layouts (`WebNavbar`, `WebFooter`, `WebLayout`), Bearer JWT interceptors (`apiClient.ts`), authentication & session state (`AuthContext`), and user IAM pages (`src/features/auth/`). | `src/core/`<br>`src/components/layout/`<br>`src/context/AuthContext.tsx`<br>`src/services/apiClient.ts`<br>`src/features/auth/` |
| **Alen Biruk** | `CTC-2176-26` | **Web Platform Engineer** | **Farm Operations & IoT Soil Sensor Fleet**: Farm registry list (`FarmListPage`), new plot registration form (`RegisterFarmPage`), IoT soil probe monitor (`SensorMonitorPage`), volumetric water content gauges (`SensorGauge`), and `useFarms` / `useSensorTelemetry` custom hooks. | `src/features/farm-operations/pages/*`<br>`src/features/farm-operations/components/*`<br>`src/features/farm-operations/services/*`<br>`src/features/farm-operations/types/*` |
| **Zinegnaw** | `CTC-514-26` | **Web Platform Engineer** | **Crop AI Vision, Plant Pathology & Treatments**: Interactive camera viewfinder with live webcam video capture (`CameraViewfinder`), crop scan workflow (`ScanCropPage`), disease outcome cards (`DiagnosisResultCard`), diagnostic history explorer (`DiagnosisHistoryPage`), deep-dive case report (`DiagnosisDetailPage`), and `useCropDiagnosis` custom hook. | `src/features/crop-pathology/pages/*`<br>`src/features/crop-pathology/components/*`<br>`src/features/crop-pathology/services/*`<br>`src/features/crop-pathology/hooks/*` |
| **Banchamlak Golla** | `CTC-2952-26` | **Web Platform Engineer** | **Planetary Weather Forecasts, Hazards & Livestock Care**: Hyper-local weather telemetry page (`WeatherForecastPage`), 24-hour temperature curves & 7-day agricultural outlook, multi-hazard early warning center (`HazardsEarlyWarningPage`, `HazardAlertCard`), and livestock herd registry (`LivestockRegistryPage`). | `src/features/weather-livestock/pages/*`<br>`src/features/weather-livestock/components/*`<br>`src/features/weather-livestock/services/*`<br>`src/features/weather-livestock/hooks/*` |

---

## 📚 Compulsory Developer Documentation

For technical implementation blueprints and API contracts, refer to the [**Web Documentation Catalog**](docs/README.md):

1. [**`docs/README.md`**](docs/README.md) — Master documentation catalog index.
2. [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md) — Multi-device DDMA architecture, responsive layouts, networking layer, and TypeScript coding standards.
3. [**`docs/MODULE_SPECIFICATIONS.md`**](docs/MODULE_SPECIFICATIONS.md) — Exhaustive developer specifications, data contracts, and component mapping across all modules.
4. [**`docs/API_INTEGRATION_GUIDE.md`**](docs/API_INTEGRATION_GUIDE.md) — Backend REST endpoint inventory, response envelopes, JWT authentication, and network resilience.

---

## 🏛️ Project Directory Structure

```text
ethiofarm-web/
├── docs/                                  <-- Crucial Developer Documentation Suite
│   ├── README.md                          <-- Documentation Catalog Index
│   ├── ARCHITECTURE.md                    <-- Multi-Device Responsive Architecture & TypeScript Standards
│   ├── MODULE_SPECIFICATIONS.md           <-- Exhaustive Technical Module Specifications
│   └── API_INTEGRATION_GUIDE.md           <-- Backend REST Endpoints & JWT Integration
├── src/
│   ├── features/                          <-- Isolated domain modules
│   │   ├── auth/                          <-- Shared IAM (Login, Registration, Password Recovery)
│   │   ├── farm-operations/               <-- ALEN (Farms, GIS & IoT Sensors)
│   │   ├── crop-pathology/                <-- ZINEGNAW (AI Vision & Diseases)
│   │   └── weather-livestock/             <-- BANCHAMLAK (Weather, Hazards & Livestock)
│   ├── components/layout/                 <-- Shared responsive layout (WebNavbar, WebFooter, WebLayout)
│   ├── context/                           <-- Global session & auth state (AuthContext.tsx)
│   ├── services/                          <-- Axios HTTP client envelope (apiClient.ts)
│   ├── routes/                            <-- Central application routing (AppRoutes.tsx)
│   ├── App.tsx                            <-- Application root
│   └── main.tsx                           <-- Vite entry point
├── package.json                           <-- Dependencies & build scripts
└── vite.config.ts                         <-- Vite configuration
```

---

## 🛡️ Production Quality Gates

- **Zero TypeScript Compiler Errors**: Verified clean build via `tsc -b` and `vite build`.
- **Responsive Layout**: Designed for seamless usability across 4K workstations, laptops, and tablets without mobile frame mockups.
- **Domain Isolation**: Each feature domain is self-contained with its own pages, components, hooks, services, and TypeScript contracts.
