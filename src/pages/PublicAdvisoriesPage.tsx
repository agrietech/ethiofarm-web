import React, { useState } from 'react';
import {
  BellRing,
  Search,
  PhoneCall,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const PublicAdvisoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Pest & Disease', 'Weather Hazards', 'Crop Protection'];

  const advisories = [
    {
      title: 'Highland Yellow Rust Outbreak Warning on Meher Wheat',
      category: 'Pest & Disease',
      region: 'Oromia (Arsi & Bale) & Sidama Highlands',
      date: 'Current Season',
      summary:
        'Continuous cool, humid highland conditions trigger early stem and yellow stripe rust pustules on susceptible wheat cultivars. Farmers and extension workers are urged to inspect lower leaf stalks regularly.',
      action:
        'Apply recommended systemic protective fungicides during clear morning windows before upcoming rainfall.',
      source: 'Agricultural Research Pathology Division',
    },
    {
      title: 'Nocturnal Ground Frost Risk for Highland Elevations',
      category: 'Weather Hazards',
      region: 'Amhara (North Shewa & South Gondar)',
      date: 'Current Season',
      summary:
        'Clear nocturnal skies and low relative humidity lower surface ground temperatures significantly in highland plateaus. Legumes and potato fields at flowering stage are at immediate risk of cold frost burn.',
      action:
        'Apply protective evening surface straw mulch or light evening irrigation to elevate soil thermal mass.',
      source: 'Meteorology Institute & Agricultural Weather Network',
    },
    {
      title: 'Desert Locust Swarm Movement Surveillance',
      category: 'Pest & Disease',
      region: 'Somali Region & Afar Lowlands',
      date: 'Current Season',
      summary:
        'Scattered hopper bands detected along coastal breeding zones moving westward toward grazing corridors. Aerial survey and biological control teams are active in monitoring routes.',
      action:
        'Report any locust band sightings immediately to your local Kebele extension agent or district agriculture office.',
      source: 'Regional Locust Surveillance Network',
    },
    {
      title: 'Coffee Berry Disease (CBD) Bi-Weekly Spraying Calendar',
      category: 'Crop Protection',
      region: 'Sidama, Oromia (Jimma, Kaffa) & South Ethiopia',
      date: 'Current Season',
      summary:
        'Optimal bi-weekly copper hydroxide preventive spraying window open across southwestern agro-forestry parcels. Atmospheric wind speeds are calm and favorable.',
      action:
        'Conduct canopy application during morning hours when winds are calm. Always wear recommended field protective gear.',
      source: 'Coffee Agricultural Research Center',
    },
  ];

  const filtered = advisories.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      a.title.toLowerCase().includes(q) ||
      a.region.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="landing-page-root">
      {/* Header Banner */}
      <section className="landing-subpage-header">
        <div className="landing-container">
          <h1 className="landing-subpage-title">National Crop Bulletins & Climate Advisories</h1>
          <p className="landing-subpage-desc">
            Pest warnings, frost notices, spray calendars, and agronomic guidance published to safeguard
            farming yields and protect crop health.
          </p>
        </div>
      </section>

      {/* Helpline Card */}
      <section className="landing-section" style={{ paddingBottom: 0 }}>
        <div className="landing-container">
          <div className="landing-hotline-card">
            <div className="landing-hotline-icon">
              <PhoneCall size={28} color="#16A34A" />
            </div>
            <div className="landing-hotline-text">
              <h4>Farmer Advisory Hotline & SMS Alerts</h4>
              <p>
                Need direct agronomic support? Call toll-free{' '}
                <strong>8440</strong> or text for real-time Amharic, Oromo, Tigrinya, and Somali field guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-advisories-toolbar">
            <div className="landing-search-box">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by crop, region (e.g. Arsi, Jimma), or disease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="landing-search-input"
              />
            </div>

            <div className="landing-filter-chips">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`landing-filter-chip ${isSelected ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advisories Grid */}
          <div className="landing-advisories-list">
            {filtered.length === 0 ? (
              <div className="landing-empty-state">
                <AlertTriangle size={36} color="var(--text-muted)" />
                <h4>No advisories match your search</h4>
                <p>Try clearing filters or searching with different keywords.</p>
              </div>
            ) : (
              filtered.map((adv) => (
                <div key={adv.title} className="landing-advisory-card" style={{ borderLeftColor: 'var(--primary)' }}>
                  <div className="landing-advisory-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                      <span>{adv.category}</span>
                    </div>
                    <div className="landing-advisory-date">
                      <Calendar size={13} />
                      <span>{adv.date}</span>
                    </div>
                  </div>

                  <h3 className="landing-advisory-card-title">{adv.title}</h3>

                  <div className="landing-advisory-region">
                    <MapPin size={14} color="var(--primary)" />
                    <span>Jurisdiction: {adv.region}</span>
                  </div>

                  <p className="landing-advisory-card-desc">{adv.summary}</p>

                  <div className="landing-advisory-action-box">
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <div>
                      <strong>Recommended Action:</strong> {adv.action}
                    </div>
                  </div>

                  <div className="landing-advisory-card-footer">
                    <span className="landing-advisory-source">Source: {adv.source}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default PublicAdvisoriesPage;
