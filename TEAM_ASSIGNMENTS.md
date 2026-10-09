# EthioFarm Web Portal — 3-Engineer Task Allocation & Architecture
### Enterprise Responsive Web Platform for All Devices (Desktops, Laptops, Tablets)

> [!NOTE]
> The mobile smartphone application is built separately in Flutter (`agriEtech-frontend`).
> `ethiofarm-web` is the dedicated **Enterprise Web Portal** for all devices.
> All files in `src/features/` have been initialized as **clean architectural skeletons with zero mock code**, allowing **Alen**, **Zinegnaw**, and **Banchamlak** to write the web implementation code themselves with zero merge conflicts.

---

## 🏛️ Domain-Driven Architecture Overview

```text
ethiofarm-web/src/
├── features/
│   ├── auth/                <── Shared IAM (User Login, User Registration & Password Recovery)
│   ├── farm-operations/     <── ALEN (Farms, GIS Polygons & IoT Ground Sensors)
│   ├── crop-pathology/      <── ZINEGNAW (AI Vision, Leaf Pathology & Treatments)
│   └── weather-livestock/   <── BANCHAMLAK (Agro-Weather, Early Warnings & Livestock)
├── components/layout/       <── Shared Responsive Web Layout (WebNavbar, WebFooter, WebLayout)
├── context/                 <── Global Auth & Network Context
├── services/                <── Axios HTTP Client Envelope
└── routes/                  <── Central Application Routing
```

---

## 👥 Assigned Engineers & Work Breakdown

### 🧑‍💻 1. Alen: Farm Operations, GIS & IoT Ground Sensors
* **Assigned Engineer**: **Alen**
* **Assigned Directory**: `src/features/farm-operations/`
* **Git Branch**: `feature/alen-farm-operations-and-sensors`
* **Target PR Base**: `develop`
* **Full Specification**: [ALEN_TASK_SPECIFICATION.md](docs/ALEN_TASK_SPECIFICATION.md)

#### Alen's Clean Skeleton Files:
1. `types/farm.types.ts`: Farm contracts, GPS coordinates, Agro-Ecological Zones (AEZ), and probe thresholds.
2. `services/farm.service.ts`: HTTP methods connecting to `/api/v1/farms` and `/api/v1/sensors`.
3. `hooks/useFarms.ts`: State hook for user farms.
4. `hooks/useSensorTelemetry.ts`: State hook for probe moisture and battery levels.
5. `components/FarmCard.tsx`: Presentation card stub for farm plot overview.
6. `components/SensorGauge.tsx`: Visual gauge stub for Volumetric Water Content (VWC %), temp, and battery.
7. `pages/FarmListPage.tsx`: Responsive web dashboard listing registered farms.
8. `pages/RegisterFarmPage.tsx`: Web form with coordinate capture and AEZ selectors.
9. `pages/SensorMonitorPage.tsx`: Real-time probe telemetry web dashboard.

---

### 👩‍💻 2. Zinegnaw: Crop AI, Plant Pathology & Camera Vision
* **Assigned Engineer**: **Zinegnaw**
* **Assigned Directory**: `src/features/crop-pathology/`
* **Git Branch**: `feature/zinegnaw-crop-pathology-and-ai-vision`
* **Target PR Base**: `develop`
* **Full Specification**: [ZINEGNAW_TASK_SPECIFICATION.md](docs/ZINEGNAW_TASK_SPECIFICATION.md)

#### Zinegnaw's Clean Skeleton Files:
1. `types/crop-pathology.types.ts`: Diagnosis records, disease classification, and treatment protocol contracts.
2. `services/crop-pathology.service.ts`: HTTP methods connecting to `/api/v1/diagnosis/scan`, `/history`, and `/escalate`.
3. `hooks/useCropDiagnosis.ts`: State hook managing image capture and AI inference.
4. `components/CameraViewfinder.tsx`: Web uploader and webcam capture preview.
5. `components/DiagnosisResultCard.tsx`: Severity badge, disease classification, and confidence score.
6. `pages/ScanCropPage.tsx`: Leaf photo camera snap/upload screen with crop selector (Teff, Coffee, Maize, Wheat).
7. `pages/DiagnosisHistoryPage.tsx`: Chronological web log of past diagnosis scans.
8. `pages/DiagnosisDetailPage.tsx`: Curative plan (organic controls, cooperative union inputs) and DA escalation CTA.

---

### 👨‍💻 3. Banchamlak: Planetary GIS, Weather, Hazards & Livestock
* **Assigned Engineer**: **Banchamlak**
* **Assigned Directory**: `src/features/weather-livestock/`
* **Git Branch**: `feature/banchamlak-weather-and-livestock`
* **Target PR Base**: `develop`
* **Full Specification**: [BANCHAMLAK_TASK_SPECIFICATION.md](docs/BANCHAMLAK_TASK_SPECIFICATION.md)

#### Banchamlak's Clean Skeleton Files:
1. `types/weather-livestock.types.ts`: Weather telemetry, 24h hourly points, hazard alerts, satellite metrics, and livestock herds.
2. `services/weather-livestock.service.ts`: HTTP methods connecting to `/api/v1/weather`, `/alerts`, and `/animal-health`.
3. `hooks/useLiveWeather.ts`: State hook fetching current telemetry and hourly forecasts for coordinates.
4. `components/WeatherWidget.tsx`: Real-time weather card with 24-hour horizontal forecast curve.
5. `components/HazardAlertCard.tsx`: Multi-hazard alert cards (Drought SPI-3, GloFAS flood, locust swarms).
6. `pages/WeatherForecastPage.tsx`: Hyper-local weather page with 24h curve and 7-day agro-weather outlook.
7. `pages/HazardsEarlyWarningPage.tsx`: Early warning bulletin board with color-coded severity tiers.
8. `pages/LivestockRegistryPage.tsx`: Herd tracking registry, health status tags, and vaccination campaign progress.

---

## 🛡️ Enterprise Zero-Conflict Git Rules

1. **Strict Folder Isolation**:
   * Alen works **only** in `src/features/farm-operations/`.
   * Zinegnaw works **only** in `src/features/crop-pathology/`.
   * Banchamlak works **only** in `src/features/weather-livestock/`.
2. **Never Edit Shared Files Directly**:
   * `src/routes/AppRoutes.tsx`, `src/App.tsx`, and `src/index.css` are locked.
3. **Branching Workflow**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/<your-name>-<feature-slug>
   ```
4. **All PRs Target `develop`**:
   * Pull requests must target `develop`. No developer pushes directly to `main`.
   * `npm run build` must pass with 0 errors before submitting PR.
