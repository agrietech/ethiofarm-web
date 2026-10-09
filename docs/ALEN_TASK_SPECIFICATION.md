# 🧑‍💻 Developer Task Specification: Alen
## Feature Domain: Farm Operations, GIS & IoT Ground Sensors
### EthioFarm Enterprise Web Platform (Responsive Web for All Devices)

* **Assigned Engineer**: **Alen**
* **Assigned Directory**: `src/features/farm-operations/`
* **Git Working Branch**: `feature/alen-farm-operations-and-sensors`
* **Target PR Base Branch**: `develop`
* **Device Scope**: Enterprise Responsive Web for all devices (Desktops, Laptops, Tablets, Large Displays). Note: Native smartphone app is built separately in Flutter (`agriEtech-frontend`).

> [!NOTE]
> All files in your assigned directory have been initialized as **clean architectural skeletons with zero mock code**. You will implement the UI components, state management, and web layout yourself.

---

### 1. 📂 File Manifest & Ownership for Alen

Alen has **exclusive ownership** over the following files:

```text
src/features/farm-operations/
├── types/
│   └── farm.types.ts              <-- Enterprise data contracts for farms, GPS, and sensors
├── services/
│   └── farm.service.ts            <-- API client methods for backend endpoints
├── hooks/
│   ├── useFarms.ts                <-- React hook managing farm listing state
│   └── useSensorTelemetry.ts      <-- React hook managing live sensor telemetry
├── components/
│   ├── FarmCard.tsx               <-- Presentation card for farm plot overview
│   └── SensorGauge.tsx            <-- Visualizer for VWC % moisture, temp, and battery
└── pages/
    ├── FarmListPage.tsx           <-- Main web dashboard listing registered farms
    ├── RegisterFarmPage.tsx       <-- Web form capturing GPS coordinates and Woreda ID
    └── SensorMonitorPage.tsx      <-- Real-time probe telemetry web dashboard
```

---

### 2. 📝 File-by-File Technical Responsibilities

#### A. `types/farm.types.ts`
* **Objective**: Define data contracts matching backend PostgreSQL Prisma schema.
* **Key Contracts**:
  * `Farm`: `id`, `name`, `ownerId`, `woredaId`, `kebeleId`, `areaHectares`, `agroEcologicalZone` (`DEGA`, `WOYNA_DEGA`, `KOLLA`, `BEREHA`, `WURCH`), `primaryCrop`, `coordinates` (`latitude`, `longitude`), `boundaryGeoJson`.
  * `SoilSensor`: `id`, `farmId`, `deviceSerial`, `depthCm`, `soilMoistureVwcPct`, `soilTemperatureC`, `batteryPct`, `status` (`OPTIMAL`, `DRY_STRESS`, `SATURATED`, `OFFLINE`).
  * `RegisterFarmPayload`: Data sent when registering a farm.

#### B. `services/farm.service.ts`
* **Objective**: Wire HTTP calls to backend endpoints using `apiClient`.
* **Endpoints**:
  * `getFarms()`: `GET /api/v1/farms` — Returns list of farms for authenticated user.
  * `getFarmById(id)`: `GET /api/v1/farms/:id` — Returns single farm details.
  * `registerFarm(payload)`: `POST /api/v1/farms` — Registers a farm plot.
  * `getFarmSensors(farmId)`: `GET /api/v1/sensors/farm/:farmId` — Returns probe telemetry.

#### C. `hooks/useFarms.ts`
* **Objective**: Manage stateful data fetching, loading spinners, and error alerts.
* **Exports**: `{ farms: Farm[], loading: boolean, error: string | null, fetchFarms: () => Promise<void> }`.

#### D. `hooks/useSensorTelemetry.ts`
* **Objective**: Manage real-time soil probe telemetry state and polling.
* **Exports**: `{ sensors: SoilSensor[], loading: boolean, error: string | null, fetchSensors: (farmId: string) => Promise<void> }`.

#### E. `components/FarmCard.tsx`
* **Objective**: Render an individual farm's details in a clean responsive web card.
* **Elements**: Farm name, area in hectares badge, primary crop badge, AEZ badge, Woreda location, and link to Sensor Telemetry view.

#### F. `components/SensorGauge.tsx`
* **Objective**: Visualizer for soil moisture, temperature, and probe battery.
* **Elements**: Moisture dial/bar, temperature thermometer display, and battery percentage status.

#### G. `pages/FarmListPage.tsx`
* **Objective**: Primary web dashboard for viewing all registered farms.
* **Features**: Responsive table/card grid for desktops and tablets, loading skeletons, empty state with CTA, and link to registration page.

#### H. `pages/RegisterFarmPage.tsx`
* **Objective**: Responsive web form for registering agricultural land.
* **Features**: Inputs for Farm Name, Area (Hectares), Primary Crop dropdown, coordinates input / web map picker, and submit handler.

#### I. `pages/SensorMonitorPage.tsx`
* **Objective**: Real-time ground sensor web inspection dashboard.
* **Features**: Displays Volumetric Water Content (VWC %), Soil Temperature (°C), and Probe Battery Health (%).

---

### 3. 🎯 Acceptance Criteria for Alen
- [ ] Alen can run `npm run build` with zero TypeScript errors.
- [ ] Responsive web grid/table displays registered farms across desktop and tablet screens.
- [ ] User can click "Register New Farm", input details, and submit.
- [ ] Sensor telemetry dashboard displays probe moisture and temperature.
- [ ] Work is committed only to `feature/alen-farm-operations-and-sensors` and opened as a PR to `develop`.

---

### 4. 🚀 Step-by-Step Git Workflow for Alen

```bash
# 1. Update local develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/alen-farm-operations-and-sensors

# 3. Work only within assigned directory: src/features/farm-operations/
# Write web code...

# 4. Verify build passes
npm run build

# 5. Commit with conventional commit messages
git add src/features/farm-operations/
git commit -m "feat(farm-operations): implement farm registry and sensor web interface"

# 6. Push to origin
git push origin feature/alen-farm-operations-and-sensors

# 7. Open Pull Request on GitHub:
# Base: develop  <--  Compare: feature/alen-farm-operations-and-sensors
```
