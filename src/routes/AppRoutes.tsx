import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WebLayout } from '../components/layout/WebLayout';
import { LandingPage } from '../pages/LandingPage';
import { PublicFeaturesPage } from '../pages/PublicFeaturesPage';
import { PublicAdvisoriesPage } from '../pages/PublicAdvisoriesPage';
import { PublicAboutPage } from '../pages/PublicAboutPage';
import { HomePage } from '../pages/HomePage';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

import FarmListPage from '../features/farm-operations/pages/FarmListPage';
import RegisterFarmPage from '../features/farm-operations/pages/RegisterFarmPage';
import SensorMonitorPage from '../features/farm-operations/pages/SensorMonitorPage';

import ScanCropPage from '../features/crop-pathology/pages/ScanCropPage';
import DiagnosisHistoryPage from '../features/crop-pathology/pages/DiagnosisHistoryPage';
import DiagnosisDetailPage from '../features/crop-pathology/pages/DiagnosisDetailPage';

import { WeatherForecastPage } from '../features/weather-livestock/pages/WeatherForecastPage';
import { HazardsEarlyWarningPage } from '../features/weather-livestock/pages/HazardsEarlyWarningPage';
import { LivestockRegistryPage } from '../features/weather-livestock/pages/LivestockRegistryPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WebLayout />}>
        {/* Public Pages */}
        <Route index element={<LandingPage />} />
        <Route path="landing" element={<LandingPage />} />
        <Route path="features" element={<PublicFeaturesPage />} />
        <Route path="advisories" element={<PublicAdvisoriesPage />} />
        <Route path="about" element={<PublicAboutPage />} />

        {/* Operational Dashboard & Overview */}
        <Route path="overview" element={<HomePage />} />
        <Route path="dashboard" element={<HomePage />} />

        {/* Authentication */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Farm Operations */}
        <Route path="farms" element={<FarmListPage />} />
        <Route path="farms/register" element={<RegisterFarmPage />} />
        <Route path="sensors" element={<SensorMonitorPage />} />
        <Route path="sensors/:farmId" element={<SensorMonitorPage />} />

        {/* AI Crop Pathology */}
        <Route path="scan" element={<ScanCropPage />} />
        <Route path="scan/:id" element={<DiagnosisDetailPage />} />
        <Route path="diagnosis/:id" element={<DiagnosisDetailPage />} />
        <Route path="diagnosis/history" element={<DiagnosisHistoryPage />} />

        {/* Agro-Weather & Multi-Hazard Climate */}
        <Route path="weather" element={<WeatherForecastPage />} />
        <Route path="hazards" element={<HazardsEarlyWarningPage />} />
        <Route path="risk" element={<LivestockRegistryPage />} />
        <Route path="livestock" element={<LivestockRegistryPage />} />

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
