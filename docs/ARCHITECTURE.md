# EthioFarm Web Client — Enterprise Architecture & System Specification

This document details the architectural principles, component layout, responsive web foundations, and domain partitioning of the **EthioFarm Smart Farming System** enterprise web portal (`ethiofarm-web`).

---

## 1. 🏗️ High-Level Architectural Pattern

`ethiofarm-web` is built using **Domain-Driven Modular Architecture (DDMA)** with a **Full Responsive Web Shell for All Devices**:

> [!NOTE]
> The mobile smartphone application is built as a separate client in Flutter (`agriEtech-frontend`). 
> `ethiofarm-web` is the **enterprise responsive web portal** serving desktop workstations, laptops, tablets, and large displays.

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
  * **Top Bar (`WebNavbar.tsx`)**: Displays branding, primary module links with engineer attribution chips (**Alen**, **Zinegnaw**, **Banchamlak**), and status.
  * **Responsive Grid System**: `.grid-responsive`, `.grid-cols-2`, `.grid-cols-3` adapting cleanly from 1920px 4K monitors down to 768px tablets.
  * **Web Footer (`WebFooter.tsx`)**: Standard web footer displaying platform version, multi-device support note, and team attribution.
* **Component Canvas Model**:
  * All module files are prepared as clean, type-safe architectural stubs with zero mock UI bloat.
  * Engineers open their designated files and write their own JSX, hooks, state, and API requests directly.

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

1. **Shared IAM (Identity & Access)**: `src/features/auth/` — User account registration, login authentication, and password recovery.
2. **Alen**: `src/features/farm-operations/` — Farm plot registry, GIS boundaries, and IoT probe moisture.
3. **Zinegnaw**: `src/features/crop-pathology/` — Leaf pathology photo scanner, Gemini AI vision, organic treatment protocols, and DA escalation.
4. **Banchamlak**: `src/features/weather-livestock/` — Hyper-local weather telemetry, 24h curves, 7-day outlook, multi-hazard early warnings, and livestock herd tracking.
