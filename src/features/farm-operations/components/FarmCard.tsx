/**
 * @file FarmCard.tsx
 * @owner Alen
 * @feature Farm Operations & IoT Ground Sensors
 */

import { Link } from "react-router-dom";
import type { Farm } from "../types/farm.types";
import "./farm-operations.css";

export default function FarmCard({ farm }: { farm: Farm }) {
  return (
    <div className="fo-card">
      <h3>{farm.name}</h3>
      <div className="fo-badges">
        <span className="fo-badge">{farm.areaHectares} ha</span>
        <span className="fo-badge">{farm.primaryCrop}</span>
        <span className="fo-badge">{farm.agroEcologicalZone}</span>
      </div>
      <p>
        Woreda: {farm.woredaId} · Kebele: {farm.kebeleId}
      </p>
      <Link to={`/farms/${farm.id}/sensors`}>View sensor telemetry →</Link>
    </div>
  );
}

export {};
