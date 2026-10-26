import React from 'react';

export const WebFooter: React.FC = () => {
  return (
    <footer className="web-footer">
      <div className="footer-inner">
        <div>
          <strong>EthioFarm Smart Farming System</strong> — Enterprise Web Platform
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
