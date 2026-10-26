import React from 'react';
import { Outlet } from 'react-router-dom';
import { WebNavbar } from './WebNavbar';
import { WebFooter } from './WebFooter';

export const WebLayout: React.FC = () => {
  return (
    <div className="web-app-container">
      <WebNavbar />
      <main className="main-content">
        <Outlet />
      </main>
      <WebFooter />
    </div>
  );
};
