
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerFarm } from "../services/farm.service";
import type { AgroEcologicalZone } from "../types/farm.types";
import "../components/farm-operations.css";

const CROPS = [
  "Teff",
  "Wheat",
  "Maize",
  "Barley",
  "Sorghum",
  "Coffee",
  "Other",
];
const ZONES: AgroEcologicalZone[] = [
  "DEGA",
  "WOYNA_DEGA",
  "KOLLA",
  "BEREHA",
  "WURCH",
];

export default function RegisterFarmPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    areaHectares: "",
    primaryCrop: CROPS[0],
    agroEcologicalZone: ZONES[0] as AgroEcologicalZone,
    woredaId: "",
    kebeleId: "",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const area = Number(form.areaHectares);
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);

    if (!form.name.trim() || !form.woredaId.trim() || !form.kebeleId.trim()) {
      return setError("Name, Woreda ID and Kebele ID are required.");
    }
    if (!(area > 0)) return setError("Area must be greater than 0.");
    if (form.latitude === "" || lat < -90 || lat > 90)
      return setError("Latitude must be between -90 and 90.");
    if (form.longitude === "" || lng < -180 || lng > 180)
      return setError("Longitude must be between -180 and 180.");

    setError(null);
    setSubmitting(true);
    try {
      await registerFarm({
        name: form.name.trim(),
        areaHectares: area,
        primaryCrop: form.primaryCrop,
        agroEcologicalZone: form.agroEcologicalZone,
        woredaId: form.woredaId.trim(),
        kebeleId: form.kebeleId.trim(),
        coordinates: { latitude: lat, longitude: lng },
      });
      navigate("/farms");
    } catch {
      setError("Could not register the farm. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fo-page">
      <h1>Register New Farm</h1>
      {error && <div className="fo-error">{error}</div>}
      <form className="fo-form" onSubmit={onSubmit}>
        <label>
          Farm name
          <input name="name" value={form.name} onChange={onChange} />
        </label>
        <label>
          Area (hectares)
          <input
            name="areaHectares"
            type="number"
            step="any"
            value={form.areaHectares}
            onChange={onChange}
          />
        </label>
        <label>
          Primary crop
          <select
            name="primaryCrop"
            value={form.primaryCrop}
            onChange={onChange}
          >
            {CROPS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Agro-ecological zone
          <select
            name="agroEcologicalZone"
            value={form.agroEcologicalZone}
            onChange={onChange}
          >
            {ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </label>
        <label>
          Woreda ID
          <input name="woredaId" value={form.woredaId} onChange={onChange} />
        </label>
        <label>
          Kebele ID
          <input name="kebeleId" value={form.kebeleId} onChange={onChange} />
        </label>
        <label>
          Latitude
          <input
            name="latitude"
            type="number"
            step="any"
            value={form.latitude}
            onChange={onChange}
          />
        </label>
        <label>
          Longitude
          <input
            name="longitude"
            type="number"
            step="any"
            value={form.longitude}
            onChange={onChange}
          />
        </label>
        <button className="fo-btn" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Register Farm"}
        </button>
      </form>
    </div>
  );
}

export {};
