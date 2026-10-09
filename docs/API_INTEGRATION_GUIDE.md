# EthioFarm Web Client — API Integration Guide

This guide specifies how the `ethiofarm-web` frontend communicates with the live backend engine.

---

## 1. 🌐 Environments & Base URLs

| Environment | Base URL | Notes |
| :--- | :--- | :--- |
| **Production (Render)** | `https://agrietech.onrender.com/api/v1` | Live production API engine with GEE and Open-Meteo integrations. |
| **Local Development** | `http://localhost:5000/api/v1` | For local full-stack development with Docker/PostgreSQL. |

The API URL is configured in `src/services/apiClient.ts` via `import.meta.env.VITE_API_URL`.

---

## 2. 🔐 Authentication & JWT Headers

All protected endpoints require an `Authorization` header containing a valid JSON Web Token:

```http
Authorization: Bearer <jwt_access_token>
```

The token is stored in browser `localStorage.getItem('ethiofarm_token')` and injected automatically by the request interceptor in `src/services/apiClient.ts`.

---

## 3. 📦 Standard API Response Envelopes

### Success Envelope
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "timestamp": "2026-10-09T13:15:00.000Z"
}
```

### Error Envelope
```json
{
  "success": false,
  "message": "Invalid credentials or missing required field",
  "error": "BAD_REQUEST",
  "timestamp": "2026-10-09T13:15:00.000Z"
}
```

---

## 4. 📡 Complete Endpoint Reference by Feature

### 🔐 Identity, Authentication & User Onboarding (Shared IAM)
* **Directory**: `src/features/auth/`
* **Service**: `src/features/auth/services/auth.service.ts`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/login` | User login with credentials | No |
| `POST` | `/auth/register` | New farmer / officer user account registration | No |
| `POST` | `/auth/forgot-password` | Request password reset token / OTP | No |
| `POST` | `/auth/reset-password` | Reset account password | No |
| `GET` | `/auth/me` | Fetch authenticated user profile & role | Yes |
| `POST` | `/auth/logout` | Revoke session and logout | Yes |

### 🌾 Farm Operations & IoT Ground Sensors (Alen)
* **Directory**: `src/features/farm-operations/`
* **Service**: `src/features/farm-operations/services/farm.service.ts`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/farms` | List user or jurisdiction farms | Yes |
| `GET` | `/farms/:id` | Get farm plot detail and polygon geometry | Yes |
| `POST` | `/farms` | Register new farm with GPS center | Yes |
| `GET` | `/sensors/farm/:farmId` | Get IoT soil moisture and probe telemetry | Yes |

### 🔬 Crop Disease & Plant Pathology (Zinegnaw)
* **Directory**: `src/features/crop-pathology/`
* **Service**: `src/features/crop-pathology/services/crop-pathology.service.ts`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/diagnosis/scan` | Upload leaf image (`multipart/form-data`) | Yes |
| `GET` | `/diagnosis/history` | List diagnostic history for current farmer | Yes |
| `GET` | `/diagnosis/:id` | Get treatment plan and disease details | Yes |
| `POST` | `/diagnosis/:id/escalate` | Escalate diagnosis case to Development Agent | Yes |

### 🌦️ Agro-Weather, Hazards & Livestock (Banchamlak)
* **Directory**: `src/features/weather-livestock/`
* **Service**: `src/features/weather-livestock/services/weather-livestock.service.ts`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/weather/forecast` | 24h curve and 7-day weather forecast (`?lat=&lng=&days=7`) | Yes/No |
| `GET` | `/weather/planetary` | Planetary metrics: Sentinel-2 NDVI, SAR soil moisture, elevation | Yes |
| `GET` | `/alerts` | Active hazard alerts (`?woredaId=&severity=`) | No |
| `GET` | `/animal-health/campaigns` | List vaccination campaigns by woreda | Yes |
| `POST` | `/animal-health/campaigns` | Create new vaccination campaign | Yes (DA/Admin) |
| `GET` | `/animal-health/livestock` | List registered livestock animals | Yes |

---

## 5. ⚠️ Error Handling & Network Resilience

* **Timeout (15s)**: Axios automatically aborts requests hanging past 15 seconds. Hooks catch this and display a retry button.
* **401 Unauthorized**: The Axios response interceptor purges `ethiofarm_token` from `localStorage` and redirects to `/login`.
* **Network Offline**: Browser connectivity listeners detect offline status and display an offline badge.
