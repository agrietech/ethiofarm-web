import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WebLayout } from '../components/layout/WebLayout';
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
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="farms" element={<FarmListPage />} />
        <Route path="farms/register" element={<RegisterFarmPage />} />
        <Route path="sensors" element={<SensorMonitorPage />} />
        <Route path="sensors/:farmId" element={<SensorMonitorPage />} />

        <Route path="scan" element={<ScanCropPage />} />
        <Route path="scan/:id" element={<DiagnosisDetailPage />} />
        <Route path="diagnosis/:id" element={<DiagnosisDetailPage />} />
        <Route path="diagnosis/history" element={<DiagnosisHistoryPage />} />

        <Route path="weather" element={<WeatherForecastPage />} />
        <Route path="hazards" element={<HazardsEarlyWarningPage />} />
        <Route path="risk" element={<LivestockRegistryPage />} />
        <Route path="livestock" element={<LivestockRegistryPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
