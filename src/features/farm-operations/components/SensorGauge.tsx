
import type { SoilSensor, SensorStatus } from "../types/farm.types";
import "./farm-operations.css";

const STATUS_COLORS: Record<SensorStatus, string> = {
  OPTIMAL: "#2e9e5b",
  DRY_STRESS: "#e8890c",
  SATURATED: "#2f7fd1",
  OFFLINE: "#8a8a8a",
};

export default function SensorGauge({ sensor }: { sensor: SoilSensor }) {
  const moisture = Math.min(100, Math.max(0, sensor.soilMoistureVwcPct));
  const battery = Math.min(100, Math.max(0, sensor.batteryPct));
  const color = STATUS_COLORS[sensor.status];

  return (
    <div className="fo-card">
      <h3>Probe {sensor.deviceSerial}</h3>
      <p>
        Depth: {sensor.depthCm} cm · Status:{" "}
        <strong style={{ color }}>{sensor.status}</strong>
      </p>

      <div className="fo-gauge-row">
        <div>Moisture (VWC): {sensor.soilMoistureVwcPct}%</div>
        <div className="fo-bar">
          <div style={{ width: `${moisture}%`, background: color }} />
        </div>
      </div>

      <div className="fo-gauge-row">
        <div>Soil temperature</div>
        <strong style={{ fontSize: 28 }}>
          🌡 {sensor.soilTemperatureC} °C
        </strong>
      </div>

      <div className="fo-gauge-row">
        <div>
          Battery: {sensor.batteryPct}% {battery < 20 && "⚠ Low"}
        </div>
        <div className="fo-bar">
          <div
            style={{
              width: `${battery}%`,
              background: battery < 20 ? "#d93025" : "#2e9e5b",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export {};
