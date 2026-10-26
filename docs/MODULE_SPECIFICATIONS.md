# EthioFarm Web Portal — Domain Module Specifications

> Comprehensive developer-standard technical specification, component hierarchy, data contracts, and REST API bindings across all web modules.

---

## 1. System Overview & Architectural Pattern

The **EthioFarm Enterprise Web Portal** (`ethiofarm-web`) is built using **Domain-Driven Modular Architecture (DDMA)** with a full responsive web shell designed for desktop workstations, field laptops, and tablets. The application architecture enforces strict domain boundaries, unidirectional data flow, and isolated feature slices.

```text
ethiofarm-web/src/
├── core/                       # Shared core abstractions & tokens
├── components/layout/          # Responsive layout shells (WebNavbar, WebFooter, WebLayout)
├── context/                    # AuthContext (JWT session, user profile, role state)
├── services/                   # Axios HTTP client envelope (Bearer JWT injection, error mapping)
├── routes/                     # Central application router (AppRoutes.tsx)
└── features/                   # Vertical domain slices
    ├── auth/                   # Shared IAM (Login, Registration, Password Recovery)
    ├── farm-operations/        # Farm Registry, GIS Boundaries & IoT Probes (Alen Biruk)
    ├── crop-pathology/         # Crop AI Vision, Leaf Diagnostics & Treatments (Zinegnaw)
    └── weather-livestock/      # Planetary Weather, Hazards & Livestock Care (Banchamlak Golla)
```

---

## 2. Module 1: Farm Operations & IoT Soil Sensor Fleet

* **Lead Engineer**: **Alen Biruk** (`CTC-2176-26`)
* **Source Directory**: `src/features/farm-operations/`

### 2.1 Functional Scope
1. **Farm Plot Registry (`FarmListPage.tsx`)**:
   - Comprehensive multi-farm overview rendering farm name, acreage in hectares, primary crop, and Agro-Ecological Zone (AEZ).
   - Empty state guidance directing users to plot onboarding.
2. **Interactive Farm Registration (`RegisterFarmPage.tsx`)**:
   - Responsive form capturing plot name, area (ha), primary crop dropdown (*Teff, Coffee, Maize, Wheat, Barley*), latitude, longitude, and Woreda identifier.
   - Coordinates validation against Ethiopian sovereign bounding limits.
3. **IoT Soil Sensor Monitoring (`SensorMonitorPage.tsx`)**:
   - Live telemetry monitoring for field-deployed soil probes querying `/api/v1/sensors/farm/:farmId`.
   - Volumetric Water Content (VWC %) visualization with dynamic hazard status:
     - $\text{VWC} < 18\%$: Drought / Desiccation Stress (Red `#EF4444`)
     - $18\% \le \text{VWC} \le 35\%$: Optimal Vegetative Growth (Green `#10B981`)
     - $\text{VWC} > 38\%$: Soil Saturation / Waterlogging (Blue `#0284C7`)
   - Soil temperature ($^\circ\text{C}$) and probe battery health percentage.

### 2.2 Component & Hook Inventory
- `components/FarmCard.tsx`: Presentation card displaying plot metrics and status badges.
- `components/SensorGauge.tsx`: Visual SVG radial/linear gauge for soil moisture and battery.
- `hooks/useFarms.ts`: Custom React hook orchestrating farm listing, caching, and mutations.
- `hooks/useSensorTelemetry.ts`: React hook managing real-time probe telemetry streams.
- `services/farm.service.ts`: REST client methods binding to `/api/v1/farms` and `/api/v1/sensors`.

### 2.3 Core Data Contracts (`types/farm.types.ts`)
```typescript
export interface Farm {
  id: string;
  name: string;
  areaHectares: number;
  woredaId: string;
  primaryCrop?: 'TEFF' | 'COFFEE' | 'MAIZE' | 'WHEAT' | 'BARLEY';
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

## 3. Module 2: Multimodal AI Crop Pathology & Camera Vision

* **Lead Engineer**: **Zinegnaw** (`CTC-514-26`)
* **Source Directory**: `src/features/crop-pathology/`

### 3.1 Functional Scope
1. **Real-Time Camera Viewfinder & File Uploader (`CameraViewfinder.tsx`)**:
   - Interactive webcam video stream capture and drag-and-drop file uploader.
   - Client-side image validation (MIME types: `image/jpeg`, `image/png`, size limit: 10MB).
   - High-resolution preview canvas with retake/re-upload controls.
2. **Crop Disease Scanning Workflow (`ScanCropPage.tsx`)**:
   - Crop selection interface covering staple Ethiopian crops: Teff (ጤፍ), Coffee (ቡና), Maize (በቆሎ), Wheat (ስንዴ), Barley (ገብስ).
   - Multipart payload dispatch to `/api/v1/disease-diagnosis` with progress feedback.
3. **Diagnostic Evaluation Outcome Card (`DiagnosisResultCard.tsx`)**:
   - Severity-coded classification badge (*Healthy, Low, Moderate, High, Critical*).
   - AI confidence percentage meter.
   - Immediate organic and chemical treatment instructions.
4. **Historical Scan Log Explorer (`DiagnosisHistoryPage.tsx`)**:
   - Chronological historical log of past leaf diagnoses with severity status filtering.
5. **Deep-Dive Diagnostic Report (`DiagnosisDetailPage.tsx`)**:
   - Detailed symptomatic evaluation, pathogen description, and preventive measures.
   - Sourcing guide for registered inputs via primary Ethiopian agricultural cooperatives.
   - Development Agent (DA) escalation CTA for high-severity or low-confidence cases.

### 3.2 Component & Hook Inventory
- `components/CameraViewfinder.tsx`: Video stream capture and file drag-and-drop component.
- `components/DiagnosisResultCard.tsx`: Severity-coded outcome card with confidence meter.
- `pages/ScanCropPage.tsx`: Full-page crop scanning and photo capture workflow.
- `pages/DiagnosisHistoryPage.tsx`: Diagnosis history explorer with search and filter controls.
- `pages/DiagnosisDetailPage.tsx`: Deep-dive pathology report with DA escalation.
- `hooks/useCropDiagnosis.ts`: React hook managing scan state, multipart uploads, and error recovery.
- `services/crop-pathology.service.ts`: REST client connecting to `/api/v1/disease-diagnosis`.

### 3.3 Core Data Contracts (`types/crop-pathology.types.ts`)
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

## 4. Module 3: Planetary GIS, Weather Forecasts & Livestock Care

* **Lead Engineer**: **Banchamlak Golla** (`CTC-2952-26`)
* **Source Directory**: `src/features/weather-livestock/`

### 4.1 Functional Scope
1. **Hyper-Local Agro-Weather Telemetry (`WeatherForecastPage.tsx`)**:
   - Real-time weather telemetry card: Temperature ($^\circ\text{C}$), Relative Humidity ($\%$), Precipitation ($mm$), Wind Speed ($km/h$), and Reference Evapotranspiration ($ET_0$).
   - 24-hour horizontal temperature and precipitation curve.
   - 7-day agro-meteorological forecast with farming advisories.
2. **Multi-Hazard Early Warning Bulletin (`HazardsEarlyWarningPage.tsx`)**:
   - Color-coded hazard bulletins categorized into Drought SPI-3, GloFAS River Basin Discharge, and FAO Desert Locust swarms.
   - Filtering by administrative Woreda and severity level (*Advisory, Watch, Warning, Emergency*).
3. **Livestock Herd Care & Health Registry (`LivestockRegistryPage.tsx`)**:
   - Herd registry tracking cattle, sheep, goats, and camels.
   - Animal vaccination status, disease quarantine tags, and regional veterinary campaign progress.

### 4.2 Component & Hook Inventory
- `components/WeatherWidget.tsx`: Real-time weather card with 24-hour forecast curve.
- `components/HazardAlertCard.tsx`: Multi-hazard alert card with severity badges and action steps.
- `hooks/useLiveWeather.ts`: React hook fetching Open-Meteo telemetry and forecast points.
- `services/weather-livestock.service.ts`: REST methods binding to `/api/v1/weather`, `/alerts`, and `/animal-health`.

### 4.3 Core Data Contracts (`types/weather-livestock.types.ts`)
```typescript
export interface WeatherTelemetry {
  temperatureC: number;
  humidityPct: number;
  precipitationMm: number;
  windSpeedKmh: number;
  et0Mm: number;
  condition: string;
}

export interface HazardAlert {
  id: string;
  hazardType: 'DROUGHT' | 'FLOOD' | 'LOCUST' | 'FROST' | 'HEAT_STRESS';
  severity: 'ADVISORY' | 'WATCH' | 'WARNING' | 'EMERGENCY';
  woredaId: string;
  title: string;
  description: string;
  recommendedAction: string;
  createdAt: string;
}

export interface LivestockRecord {
  id: string;
  species: 'CATTLE' | 'SHEEP' | 'GOAT' | 'CAMEL';
  count: number;
  healthStatus: 'HEALTHY' | 'MONITORED' | 'QUARANTINED';
  vaccinationDate?: string;
}
```

---

## 5. Module 4: Enterprise Layout, Authentication & Security

* **Lead Architect**: **Abraham Amogne** (`CTC-329-26`)
* **Source Directories**: `src/core/`, `src/features/auth/`, `src/components/layout/`

### 5.1 Architecture & Security Scope
1. **Responsive Web Shell (`WebNavbar.tsx`, `WebFooter.tsx`)**:
   - Full responsive layout container adapting from 4K displays down to tablets.
   - Real-time attribution chips displaying the four assigned domain engineers.
2. **Authentication & Token Interceptors (`apiClient.ts`, `AuthContext.tsx`)**:
   - Secure session persistence in browser storage with automated token expiry cleanup.
   - Automatic injection of `Authorization: Bearer <token>` on all outbound REST requests.
   - Standard 15-second client timeout preventing hanging requests over rural connections.
