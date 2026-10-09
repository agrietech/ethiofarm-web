# 👨‍💻 Developer Task Specification: Banchamlak
## Feature Domain: Planetary GIS, Weather Forecast, Multi-Hazard Early Warning & Livestock Care
### EthioFarm Enterprise Web Platform (Responsive Web for All Devices)

* **Assigned Engineer**: **Banchamlak**
* **Assigned Directory**: `src/features/weather-livestock/`
* **Git Working Branch**: `feature/banchamlak-weather-and-livestock`
* **Target PR Base Branch**: `develop`
* **Device Scope**: Enterprise Responsive Web for all devices (Desktops, Laptops, Tablets, Large Displays). Note: Native smartphone app is built separately in Flutter (`agriEtech-frontend`).

> [!NOTE]
> All files in your assigned directory have been initialized as **clean architectural skeletons with zero mock code**. You will implement the UI components, state management, and web layout yourself.

---

### 1. 📂 File Manifest & Ownership for Banchamlak

Banchamlak has **exclusive ownership** over the following files:

```text
src/features/weather-livestock/
├── types/
│   └── weather-livestock.types.ts    <-- Enterprise data contracts for weather, hazards, and livestock
├── services/
│   └── weather-livestock.service.ts  <-- API client methods for agro-weather and veterinary APIs
├── hooks/
│   └── useLiveWeather.ts             <-- React hook managing live weather and hourly forecast state
├── components/
│   ├── WeatherWidget.tsx             <-- Telemetry display with 24-hour horizontal forecast curve
│   └── HazardAlertCard.tsx           <-- Severity-colored cards for flood, drought, and locust alerts
└── pages/
    ├── WeatherForecastPage.tsx       <-- Hyper-local 24h & 7-day agro-meteorological web dashboard
    ├── HazardsEarlyWarningPage.tsx   <-- Multi-hazard web bulletin board with severity filters
    └── LivestockRegistryPage.tsx     <-- Herd health tracking and vaccination campaign progress
```

---

### 2. 📝 File-by-File Technical Responsibilities

#### A. `types/weather-livestock.types.ts`
* **Objective**: Define data contracts matching backend weather engine, hazard models, and veterinary Prisma schema.
* **Key Contracts**:
  * `HourlyWeatherPoint`: `time`, `temperatureC`, `precipitationMm`, `precipitationProbabilityPct`, `relativeHumidityPct`, `windSpeedKmH`.
  * `WeatherForecast`: `locationName`, `current`, `hourly`, `daily`.
  * `HazardAlert`: `id`, `hazardType` (`DROUGHT`, `FLOOD`, `LOCUST`, `FIRE`, `FROST`), `severity` (`ADVISORY`, `WATCH`, `WARNING`, `CRITICAL`), `title`, `description`, `woredaId`, `issuedAt`.
  * `SatelliteMetrics`: `lat`, `lng`, `sentinel2Ndvi`, `sentinel1SarSoilMoisturePct`, `landsatLstTempC`, `elevationMeters`, `floodInundationRisk`, `droughtStressAnomaly`.
  * `LivestockRecord`: `id`, `farmerId`, `species` (`CATTLE`, `SHEEP`, `GOAT`, `CAMEL`, `POULTRY`), `tagNumber`, `healthStatus`, `vaccinations`.
  * `VaccinationCampaign`: `id`, `woredaId`, `diseaseTarget`, `targetCount`, `vaccinatedCount`, `status`.

#### B. `services/weather-livestock.service.ts`
* **Objective**: Wire HTTP calls to backend endpoints using `apiClient`.
* **Endpoints**:
  * `getWeather(lat?, lng?)`: `GET /api/v1/weather/forecast?lat={lat}&lng={lng}`
  * `getHazardAlerts(woredaId?)`: `GET /api/v1/alerts?woredaId={woredaId}`
  * `getSatelliteMetrics(lat, lng)`: `GET /api/v1/weather/planetary?lat={lat}&lng={lng}`
  * `getLivestock()`: `GET /api/v1/animal-health/livestock`
  * `registerLivestock(payload)`: `POST /api/v1/animal-health/livestock`
  * `getVaccinationCampaigns()`: `GET /api/v1/animal-health/campaigns`

#### C. `hooks/useLiveWeather.ts`
* **Objective**: Manage stateful weather telemetry fetching, coordinate resolution, and error recovery.
* **Exports**: `{ weather: WeatherForecast | null, loading: boolean, error: string | null, fetchWeather: (lat?: number, lng?: number) => Promise<void> }`.

#### D. `components/WeatherWidget.tsx`
* **Objective**: Visual widget displaying temperature, rain, wind, ET₀ loss, and 24-hr hourly trend.

#### E. `components/HazardAlertCard.tsx`
* **Objective**: Color-coded warning card for environmental risks with severity badges.

#### F. `pages/WeatherForecastPage.tsx`
* **Objective**: Primary web dashboard for agro-weather forecasting with station selection and 7-day outlook.

#### G. `pages/HazardsEarlyWarningPage.tsx`
* **Objective**: Multi-hazard early warning bulletin board with hazard category filters.

#### H. `pages/LivestockRegistryPage.tsx`
* **Objective**: Herd tracking web registry and vaccination campaign progress tracker.

---

### 3. 🎯 Acceptance Criteria for Banchamlak
- [ ] Banchamlak can run `npm run build` with zero TypeScript errors.
- [ ] Weather dashboard displays temperature, humidity, rainfall, and 24-hr hourly trend on web screens.
- [ ] Multi-hazard alerts display with appropriate severity colors (Yellow/Orange/Red).
- [ ] Livestock registry displays herd cards and vaccination campaign progress.
- [ ] Work is committed only to `feature/banchamlak-weather-and-livestock` and opened as a PR to `develop`.

---

### 4. 🚀 Step-by-Step Git Workflow for Banchamlak

```bash
# 1. Update local develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/banchamlak-weather-and-livestock

# 3. Work only within assigned directory: src/features/weather-livestock/
# Write web code...

# 4. Verify build passes
npm run build

# 5. Commit with conventional commit messages
git add src/features/weather-livestock/
git commit -m "feat(weather-livestock): implement weather telemetry and early warning web portal"

# 6. Push to origin
git push origin feature/banchamlak-weather-and-livestock

# 7. Open Pull Request on GitHub:
# Base: develop  <--  Compare: feature/banchamlak-weather-and-livestock
```
