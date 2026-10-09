/**
 * @file WebFooter.tsx
 * @description Standard responsive web footer for desktop, tablet, and widescreen devices
 */

import React from 'react';

export const WebFooter: React.FC = () => {
  return (
    <footer className="web-footer">
      <div className="footer-inner">
        <div>
          <strong>EthioFarm Smart Farming System</strong> — Enterprise Web Platform for All Devices
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Team Engineering: Alen • Zinegnaw • Banchamlak</span>
          <span>•</span>
          <span>Version 1.0.0-web</span>
        </div>
      </div>
    </footer>
  );
};
