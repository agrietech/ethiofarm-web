/**
 * @file AppRoutes.tsx
 * @description Central routing configuration
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WebLayout } from '../components/layout/WebLayout';
import { HomePage } from '../pages/HomePage';

// Banchamlak — Weather, Hazards & Livestock
import { WeatherForecastPage } from '../features/weather-livestock/pages/WeatherForecastPage';
import { HazardsEarlyWarningPage } from '../features/weather-livestock/pages/HazardsEarlyWarningPage';
import { LivestockRegistryPage } from '../features/weather-livestock/pages/LivestockRegistryPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WebLayout />}>
        <Route index element={<HomePage />} />

        {/* Banchamlak routes */}
        <Route path="weather" element={<WeatherForecastPage />} />
        <Route path="hazards" element={<HazardsEarlyWarningPage />} />
        <Route path="risk" element={<LivestockRegistryPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
