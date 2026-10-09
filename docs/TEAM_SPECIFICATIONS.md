# EthioFarm Web Portal — 3-Engineer Functional Specifications
### Enterprise Responsive Web Platform for All Devices

This document defines the functional specifications, user workflows, data contracts, and acceptance criteria for **Alen**, **Zinegnaw**, and **Banchamlak** on the **EthioFarm Web Portal** (`ethiofarm-web`).

> [!NOTE]
> The mobile smartphone application is built separately in Flutter (`agriEtech-frontend`).
> All feature files in `ethiofarm-web/src/features/` are prepared as clean, type-safe architectural skeletons with zero mock code so each engineer can implement their web features directly.

---

# 🧑‍💻 1. ALEN: Farm Operations & IoT Ground Sensors

* **Engineer**: **Alen**
* **Assigned Directory**: `src/features/farm-operations/`
* **Git Branch**: `feature/alen-farm-operations-and-sensors`
* **Target PR Base Branch**: `develop`
* **Detailed Task Document**: [ALEN_TASK_SPECIFICATION.md](./ALEN_TASK_SPECIFICATION.md)

### 📋 Web Feature Objectives for Alen
1. **Farm Plot Listing (`FarmListPage.tsx`)**:
   * Fetch and display cards/tables for all registered farms belonging to the authenticated user via `farmService.getFarms()`.
   * Display farm name, area in hectares, primary crop (Teff, Coffee, Maize, Wheat, Barley), and Agro-Ecological Zone (AEZ: Dega, Weyna Dega, Kolla, Bereha, Wurch).
   * Provide a clear CTA to register a new farm if no farms exist.
2. **Farm Registration (`RegisterFarmPage.tsx`)**:
   * Responsive web form capturing: Farm Name, Area (ha), Primary Crop dropdown, Latitude, Longitude, and Woreda ID.
   * Coordinate input or web map picker.
   * Submit to `POST /api/v1/farms` with validation.
3. **IoT Soil Sensor Monitoring (`SensorMonitorPage.tsx`)**:
   * Query `GET /api/v1/sensors/farm/:farmId` for probe hardware telemetry.
   * Render Volumetric Water Content (VWC %) with status color:
     * `< 18%`: Drought / Dry Stress (Red `#ef4444`)
     * `18% - 35%`: Optimal Growth (Green `#10b981`)
     * `> 38%`: Saturated / Waterlogging (Blue `#0284c7`)
   * Render soil temperature (°C) and probe battery health percentage.

### 📦 Key Data Contracts (`farm.types.ts`)
```typescript
export interface Farm {
  id: string;
  name: string;
  areaHectares: number;
  woredaId: string;
  primaryCrop?: string;
  agroEcologicalZone?: 'DEGA' | 'WOYNA_DEGA' | 'KOLLA' | 'BEREHA' | 'WURCH';
  coordinates: { latitude: number; longitude: number };
}

export interface SoilSensor {
  deviceSerial: string;
  soilMoistureVwcPct: number;
  soilTemperatureC: number;
  batteryPct: number;
  status: 'OPTIMAL' | 'DRY_STRESS' | 'SATURATED' | 'OFFLINE';
}
```

---

# 👩‍💻 2. ZINEGNAW: Crop AI & Plant Pathology

* **Engineer**: **Zinegnaw**
* **Assigned Directory**: `src/features/crop-pathology/`
* **Git Branch**: `feature/zinegnaw-crop-pathology-and-ai-vision`
* **Target PR Base Branch**: `develop`
* **Detailed Task Document**: [ZINEGNAW_TASK_SPECIFICATION.md](./ZINEGNAW_TASK_SPECIFICATION.md)

### 📋 Web Feature Objectives for Zinegnaw
1. **Camera & File Leaf Scanner (`ScanCropPage.tsx`)**:
   * Interactive crop selector: Teff (ጤፍ), Coffee (ቡና), Maize (በቆሎ), Wheat (ስንዴ), Barley (ገብስ).
   * Web file uploader supporting drag-and-drop or webcam capture.
   * Submit leaf image to `POST /api/v1/diagnosis/scan`.
   * Visual loading state while Gemini AI processes leaf tissue vectors.
2. **Diagnosis Result & Advisory (`DiagnosisDetailPage.tsx`)**:
   * Render identified disease name, confidence score (0-100%), and severity badge (Healthy, Low, Moderate, High, Critical).
   * Present step-by-step treatment protocol:
     * **Organic / Cultural Control**: Crop rotation, bio-pesticides, sanitation.
     * **Chemical / Input Sourcing**: Registered fungicides/pesticides available through Ethiopian agricultural cooperative unions.
3. **DA Escalation Flow**:
   * If severity is High/Critical or confidence is < 70%, provide a 1-click "Escalate to Development Agent (DA)" button submitting to `POST /api/v1/diagnosis/:id/escalate`.
4. **Historical Scans (`DiagnosisHistoryPage.tsx`)**:
   * Chronological list of previous leaf evaluations with status filter.

### 📦 Key Data Contracts (`crop-pathology.types.ts`)
```typescript
export interface DiagnosisRecord {
  id: string;
  cropName: string;
  imageUrl: string;
  diseaseIdentified: string;
  confidenceScore: number;
  severity: 'HEALTHY' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  treatment: {
    organicControl?: string[];
    chemicalControl?: string[];
    primaryCooperativeSourcing?: string;
  };
  daEscalationStatus?: 'NONE' | 'PENDING_REVIEW' | 'REVIEWED';
}
```

---

# 👨‍💻 3. BANCHAMLAK: Planetary GIS, Weather, Hazards & Livestock

* **Engineer**: **Banchamlak**
* **Assigned Directory**: `src/features/weather-livestock/`
* **Git Branch**: `feature/banchamlak-weather-and-livestock`
* **Target PR Base Branch**: `develop`
* **Detailed Task Document**: [BANCHAMLAK_TASK_SPECIFICATION.md](./BANCHAMLAK_TASK_SPECIFICATION.md)

### 📋 Web Feature Objectives for Banchamlak
1. **Agro-Weather Telemetry (`WeatherForecastPage.tsx`)**:
   * Query `GET /api/v1/weather/forecast` with user coordinates or default woreda location.
   * Render real-time telemetry card: Temperature (°C), Relative Humidity (%), Precipitation (mm), Wind Speed (km/h), and ET0 Evapotranspiration.
   * Render 24-hour horizontal forecast curve and 7-day weather trend strip.
2. **Multi-Hazard Early Warnings (`HazardsEarlyWarningPage.tsx`)**:
   * Query `GET /api/v1/alerts` for active bulletins across Ethiopia.
   * Filter hazards by type: Drought (SPI-3), Flood (GloFAS), Desert Locust Threat, Frost, and Wildfire.
   * Color-code badges by severity: Advisory (Blue), Watch (Yellow), Warning (Orange), Critical (Red).
3. **Livestock Herd & Vaccination Campaigns (`LivestockRegistryPage.tsx`)**:
   * Query `GET /api/v1/animal-health/campaigns` and `GET /api/v1/animal-health/livestock`.
   * Display active vaccination campaigns with progress bars (`vaccinatedCount` / `targetCount`).
   * List registered livestock herd (Cattle, Sheep, Goats, Camels) with health statuses (Healthy, Sick, Quarantined).

### 📦 Key Data Contracts (`weather-livestock.types.ts`)
```typescript
export interface WeatherForecast {
  locationName: string;
  current: {
    temperatureC: number;
    relativeHumidity: number;
    precipitationMm: number;
    windSpeedKmH: number;
    conditionText: string;
    et0EvapotranspirationMm?: number;
  };
  hourly: HourlyWeatherPoint[];
  daily: Array<{ date: string; tempMinC: number; tempMaxC: number; precipProbability: number }>;
}

export interface HazardAlert {
  id: string;
  hazardType: 'DROUGHT' | 'FLOOD' | 'LOCUST' | 'FIRE' | 'FROST';
  severity: 'ADVISORY' | 'WATCH' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  woredaId: string;
  issuedAt: string;
}

export interface LivestockRecord {
  id: string;
  species: 'CATTLE' | 'SHEEP' | 'GOAT' | 'CAMEL' | 'POULTRY';
  tagNumber: string;
  healthStatus: 'HEALTHY' | 'SICK' | 'QUARANTINED';
  vaccinations: Array<{ diseaseName: string; vaccinatedAt: string }>;
}
```
