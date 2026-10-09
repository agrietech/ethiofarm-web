# EthioFarm Web Client — Coding Standards & GitFlow Guidelines

This guide establishes the mandatory coding patterns, TypeScript rules, and Git collaboration workflows for all developers contributing to `ethiofarm-web`.

---

## 1. 📐 TypeScript & React Coding Standards

### Strong Typing & Interface Rules
* **No `any` Types**: Always define explicit interfaces or use `unknown` with type guards.
* **Interface Naming**: Use PascalCase without the `I` prefix (e.g., `Farm`, `DiagnosisRecord`, `WeatherForecast`).
* **Props Interfaces**: Suffix component props with `Props` (e.g., `FarmCardProps`). Export prop interfaces for reusability.

### Component Design
* **Functional Components**: Use `React.FC<Props>` or plain functions with typed props.
* **Component Size**: Keep presentation components focused (< 150 lines). Extract complex sub-widgets into separate component files.
* **Early Returns**: Handle loading and error states at the top of the component:
  ```tsx
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  ```

### Custom Hooks
* Encapsulate stateful data fetching in custom hooks (`useFarms`, `useCropDiagnosis`, `useLiveWeather`).
* Always return an object with: `data`, `loading`, `error`, and an action/refresh function.

---

## 2. 🎨 Responsive Web Styling (All Devices)

* **Design Tokens**: Always use CSS custom properties defined in `src/index.css`:
  * Colors: `var(--primary)`, `var(--primary-dark)`, `var(--accent-gold)`, `var(--surface-border)`.
  * Typography: `var(--font-family)`.
  * Radius: `var(--radius-sm)`, `var(--radius-md)`.
* **Responsive Grid & Flex**: Use responsive container utilities (`.grid-responsive`, `.grid-cols-2`, `.grid-cols-3`, `.main-content`). Do not use fixed horizontal pixel constraints that break tablet or desktop displays.
* **Touch & Mouse Ergonomics**: Form inputs and buttons must remain accessible on both desktop mouse clicks and tablet touch gestures.

---

## 3. 🌿 GitFlow Branching & Collaboration

### 1. Branch Creation
Every team member branches strictly from **`develop`**:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/<your-assigned-branch-name>
```

| Engineer | Canonical Feature Branch | Assigned Feature Directory |
| :--- | :--- | :--- |
| **Alen** | `feature/alen-farm-operations-and-sensors` | `src/features/farm-operations/` |
| **Zinegnaw** | `feature/zinegnaw-crop-pathology-and-ai-vision` | `src/features/crop-pathology/` |
| **Banchamlak** | `feature/banchamlak-weather-and-livestock` | `src/features/weather-livestock/` |

### 2. Commit Message Standard (Conventional Commits)
Format all commit messages strictly:
```text
<type>(<scope>): <concise descriptive summary>
```

**Allowed Types**:
* `feat`: A new user-facing feature.
* `fix`: A bug fix.
* `docs`: Documentation changes.
* `style`: Formatting, missing semicolons, etc.
* `refactor`: Code restructuring without changing behavior.
* `test`: Adding or updating tests.
* `chore`: Build tasks, package updates.

**Examples**:
* `feat(farm-operations): implement farm plot registration form`
* `feat(crop-pathology): connect camera uploader to Gemini AI diagnosis API`
* `feat(weather-livestock): add 24-hour weather curve and multi-hazard alert filters`

---

## 4. ✅ Pre-Pull Request Checklist

Before submitting a Pull Request into `develop`, verify:
1. `npm run build` succeeds with **0 TypeScript errors and 0 warnings**.
2. All new components are cleanly contained within your assigned feature folder.
3. No shared configuration or locked root layout files were modified without team alignment.
4. Pull Request target is set to **`develop`** (never `main`).
