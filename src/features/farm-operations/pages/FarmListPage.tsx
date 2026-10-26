
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useFarms } from "../hooks/useFarms";
import FarmCard from "../components/FarmCard";
import "../components/farm-operations.css";

export default function FarmListPage() {
  const { farms, loading, error, fetchFarms } = useFarms();

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  return (
    <div className="fo-page">
      <div className="fo-header">
        <h1>My Farms</h1>
        <Link to="/farms/register" className="fo-btn">
          Register New Farm
        </Link>
      </div>

      {error && <div className="fo-error">{error}</div>}

      {loading ? (
        <div className="fo-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="fo-skeleton" />
          ))}
        </div>
      ) : farms.length === 0 ? (
        <div className="fo-empty">
          <h2>No farms registered yet</h2>
          <p>Register your first farm plot to start monitoring it.</p>
          <Link to="/farms/register" className="fo-btn">
            Register New Farm
          </Link>
        </div>
      ) : (
        <div className="fo-grid">
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}
    </div>
  );
}

export {};
