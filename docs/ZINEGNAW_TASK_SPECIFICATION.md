# 👩‍💻 Developer Task Specification: Zinegnaw
## Feature Domain: Crop AI, Plant Pathology & Camera Vision
### EthioFarm Enterprise Web Platform (Responsive Web for All Devices)

* **Assigned Engineer**: **Zinegnaw**
* **Assigned Directory**: `src/features/crop-pathology/`
* **Git Working Branch**: `feature/zinegnaw-crop-pathology-and-ai-vision`
* **Target PR Base Branch**: `develop`
* **Device Scope**: Enterprise Responsive Web for all devices (Desktops, Laptops, Tablets, Large Displays). Note: Native smartphone app is built separately in Flutter (`agriEtech-frontend`).

> [!NOTE]
> All files in your assigned directory have been initialized as **clean architectural skeletons with zero mock code**. You will implement the UI components, state management, and web layout yourself.

---

### 1. 📂 File Manifest & Ownership for Zinegnaw

Zinegnaw has **exclusive ownership** over the following files:

```text
src/features/crop-pathology/
├── types/
│   └── crop-pathology.types.ts     <-- Enterprise data contracts for diseases, scans, and treatments
├── services/
│   └── crop-pathology.service.ts   <-- API client methods for AI diagnosis and DA escalation
├── hooks/
│   └── useCropDiagnosis.ts         <-- React hook managing photo capture and AI scan state
├── components/
│   ├── CameraViewfinder.tsx        <-- Web camera capture / file upload viewfinder component
│   └── DiagnosisResultCard.tsx     <-- Summary card for disease confidence and severity
└── pages/
    ├── ScanCropPage.tsx            <-- Main web view for uploading/scanning leaf photo
    ├── DiagnosisHistoryPage.tsx    <-- History web log of previous diagnoses
    └── DiagnosisDetailPage.tsx      <-- Full advisory web screen: organic controls & DA escalation
```

---

### 2. 📝 File-by-File Technical Responsibilities

#### A. `types/crop-pathology.types.ts`
* **Objective**: Define data contracts matching Gemini AI pathology output.
* **Key Contracts**:
  * `DiagnosisRecord`: `id`, `cropName`, `imageUrl`, `diseaseIdentified`, `confidenceScore`, `severity`, `symptoms`, `treatment`, `daEscalationStatus`.
  * `TreatmentRecommendation`: `organicControl`, `chemicalControl`, `preventiveMeasures`, `primaryCooperativeSourcing`.
  * `DiagnoseRequestPayload`: `imageFile`, `cropHint`, `farmId`.

#### B. `services/crop-pathology.service.ts`
* **Objective**: Connect to backend AI diagnosis service using `apiClient`.
* **Endpoints**:
  * `scanLeaf(payload)`: `POST /api/v1/diagnosis/scan` — Sends leaf photo and crop hint.
  * `getHistory()`: `GET /api/v1/diagnosis/history` — Returns past diagnoses for the user.
  * `getDiagnosisById(id)`: `GET /api/v1/diagnosis/:id` — Returns single diagnosis advisory.
  * `escalateToDA(id, notes)`: `POST /api/v1/diagnosis/:id/escalate` — Forwards case to Development Agent.

#### C. `hooks/useCropDiagnosis.ts`
* **Objective**: Manage asynchronous scan state, loading animations, and error recovery.
* **Exports**: `{ analyzing: boolean, currentResult: DiagnosisRecord | null, error: string | null, scanLeaf: Function, clearResult: Function }`.

#### D. `components/CameraViewfinder.tsx`
* **Objective**: Web file upload and webcam/device capture viewfinder.
* **Elements**: Drag-and-drop file upload zone, camera trigger, and image preview frame.

#### E. `components/DiagnosisResultCard.tsx`
* **Objective**: Summary card displaying diagnosis result, confidence bar, and severity badge.

#### F. `pages/ScanCropPage.tsx`
* **Objective**: Primary web screen for crop pathology diagnosis.
* **Features**: Crop species dropdown (Teff, Coffee, Maize, Wheat, Barley), web file uploader, AI progress indicator, and redirection to diagnosis detail page.

#### G. `pages/DiagnosisHistoryPage.tsx`
* **Objective**: Historical log of past crop scans with filters and severity tags.

#### H. `pages/DiagnosisDetailPage.tsx`
* **Objective**: Comprehensive agronomic advisory and DA review escalation web page.

---

### 3. 🎯 Acceptance Criteria for Zinegnaw
- [ ] Zinegnaw can run `npm run build` with zero TypeScript errors.
- [ ] Responsive web uploader allows leaf photo selection and preview.
- [ ] Diagnosis displays disease name, severity badge, and confidence percentage.
- [ ] Treatment plan displays both organic and chemical sourcing advice.
- [ ] User can click "Escalate to DA" to submit the case for review.
- [ ] Work is committed only to `feature/zinegnaw-crop-pathology-and-ai-vision` and opened as a PR to `develop`.

---

### 4. 🚀 Step-by-Step Git Workflow for Zinegnaw

```bash
# 1. Update local develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/zinegnaw-crop-pathology-and-ai-vision

# 3. Work only within assigned directory: src/features/crop-pathology/
# Write web code...

# 4. Verify build passes
npm run build

# 5. Commit with conventional commit messages
git add src/features/crop-pathology/
git commit -m "feat(crop-pathology): implement web leaf scanner and AI disease diagnosis"

# 6. Push to origin
git push origin feature/zinegnaw-crop-pathology-and-ai-vision

# 7. Open Pull Request on GitHub:
# Base: develop  <--  Compare: feature/zinegnaw-crop-pathology-and-ai-vision
```
