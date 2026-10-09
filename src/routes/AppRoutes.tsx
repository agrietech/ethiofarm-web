/**
 * @file AppRoutes.tsx
 * @description Central routing configuration
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WebLayout } from '../components/layout/WebLayout';
import { HomePage } from '../pages/HomePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WebLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
