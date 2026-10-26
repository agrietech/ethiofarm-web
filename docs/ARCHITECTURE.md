# EthioFarm Web Client — Enterprise Architecture & System Specification

This document details the architectural principles, component layout, responsive web foundations, and domain partitioning of the **EthioFarm Smart Farming System** enterprise web portal (`ethiofarm-web`).

---

## 1. 🏗️ High-Level Architectural Pattern

`ethiofarm-web` is built using **Domain-Driven Modular Architecture (DDMA)** with a **Full Responsive Web Shell for All Devices**:

> [!NOTE]
> The mobile smartphone application is built as a separate client in Flutter (`agriEtech-frontend`). 
> `ethiofarm-web` is the **enterprise responsive web portal** engineered for desktop workstations, laptops, tablets, and large displays.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        WebNavbar.tsx (Desktop & Web)                   │
│         [Brand]   [Overview]   [Farm Ops]   [Crop AI]   [Weather]      │
├────────────────────────────────────────────────────────────────────────┤
│                           AppRoutes.tsx                                │
│                     (Central Router & Layout)                          │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│       ALEN        │       ZINEGNAW       │         BANCHAMLAK          │
│  Farm Operations  │   AI Crop Disease    │    Planetary GIS, Weather   │
│   & IoT Sensors   │      Pathology       │      & Livestock Health     │
│                   │                      │                             │
│   src/features/   │    src/features/     │        src/features/        │
│  farm-operations/ │   crop-pathology/    │      weather-livestock/     │
├───────────────────┴──────────────────────┴─────────────────────────────┤
│                          Shared Foundation                             │
│    apiClient.ts (Axios + JWT)  │  index.css (Design System Tokens)     │
│    AuthContext (User Session)  │  common.types (Shared Contracts)      │
├────────────────────────────────────────────────────────────────────────┤
│                        WebFooter.tsx                                   │
│        (System Status, Multi-Device Responsiveness, Copyright)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 💻 Full Responsive Web Layout for All Devices

The application uses standard responsive web layout containers rather than mobile frame mockups:

* **Container Constraints**: Wrapped in `.web-app-container` (fluid 100% width, min-height: 100vh) with a centered `.main-content` container (`max-width: 1320px`).
* **Navigation Architecture**:
  * **Top Bar (`WebNavbar.tsx`)**: Displays branding, primary navigation routes (`Overview`, `Farm Ops`, `Crop AI`, `Weather`, `Alerts`, `Risk`), and system status badge.
  * **Responsive Grid System**: `.grid-responsive`, `.grid-cols-2`, `.grid-cols-3` adapting cleanly from 1920px 4K monitors down to 768px tablets.
  * **Web Footer (`WebFooter.tsx`)**: Standard web footer displaying platform branding and application version.
* **Component Architecture**:
  * All module files are fully implemented with clean, type-safe React 19 and TypeScript components connected to live backend APIs and custom hooks.

---

## 3. 🌐 API Client & Networking Layer

* **Base URL**: Configured via `VITE_API_URL` or defaulting to the live Render backend:
  `https://agrietech.onrender.com/api/v1`
* **JWT Interceptor (`apiClient.ts`)**:
  * Automatically injects `Authorization: Bearer <token>` on all outgoing requests.
  * Catches `401 Unauthorized` responses and cleans expired tokens.
* **Timeouts**: Strict 15-second client timeout to prevent hung requests over rural networks.

---

## 4. 🗂️ Domain Isolation & Developer Allocation

Each engineer operates with zero file collisions:

1. **System Architect & Lead**: **Abraham Amogne** (`CTC-329-26`) — Enterprise TypeScript architecture, `src/features/auth/` (IAM registration, login authentication, password recovery), core layouts (`WebNavbar`, `WebFooter`), and Axios integration.
2. **Alen Biruk** (`CTC-2176-26`): `src/features/farm-operations/` — Farm plot registry, GIS boundaries, and IoT soil probe moisture monitor.
3. **Zinegnaw** (`CTC-514-26`): `src/features/crop-pathology/` — Interactive camera viewfinder, multimodal AI crop pathology diagnostics, treatment advice, and case history.
4. **Banchamlak Golla** (`CTC-2952-26`): `src/features/weather-livestock/` — Hyper-local weather telemetry, 24h curves, 7-day outlook, multi-hazard early warnings, and livestock herd tracking.

---

## 5. 📐 TypeScript Standards & Engineering Conventions

* **Strict Typing**: Zero `any` types; all API responses and component props use explicit TypeScript interfaces.
* **State Encapsulation**: Data fetching and mutation workflows are encapsulated within custom hooks (`useFarms`, `useCropDiagnosis`, `useLiveWeather`, `useSensorTelemetry`).
* **Design Tokens**: Standardized CSS tokens in `src/index.css` for typography, spacing, surface borders, and agricultural brand colors.
* **Production Build Integrity**: Verified via `tsc -b` and `vite build` with zero compiler warnings or bundle errors.
