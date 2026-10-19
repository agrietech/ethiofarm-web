/**
 * @file SensorMonitorPage.tsx
 * @owner Alen
 * @feature Farm Operations & IoT Ground Sensors
 */

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSensorTelemetry } from "../hooks/useSensorTelemetry";
import SensorGauge from "../components/SensorGauge";
import "../components/farm-operations.css";

export default function SensorMonitorPage() {
  const { farmId } = useParams<{ farmId: string }>();
  const { sensors, loading, error, fetchSensors } = useSensorTelemetry();

  useEffect(() => {
    if (!farmId) return;
    fetchSensors(farmId);
    const timer = setInterval(() => fetchSensors(farmId), 15000);
    return () => clearInterval(timer);
  }, [farmId, fetchSensors]);

  return (
    <div className="fo-page">
      <div className="fo-header">
        <h1>Sensor Telemetry</h1>
        <Link to="/farms">← Back to farms</Link>
      </div>

      {error && <div className="fo-error">{error}</div>}

      {loading && sensors.length === 0 ? (
        <div className="fo-grid">
          {[1, 2].map((n) => (
            <div key={n} className="fo-skeleton" />
          ))}
        </div>
      ) : sensors.length === 0 ? (
        <div className="fo-empty">
          <p>No sensors found for this farm.</p>
        </div>
      ) : (
        <div className="fo-grid">
          {sensors.map((s) => (
            <SensorGauge key={s.id} sensor={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export {};
