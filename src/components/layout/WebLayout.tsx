import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { WebNavbar } from './WebNavbar';
import { WebFooter } from './WebFooter';

export const WebLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/landing' ||
    location.pathname === '/features' ||
    location.pathname === '/advisories' ||
    location.pathname === '/about';

  return (
    <div className="web-app-container">
      <WebNavbar />
      <main className={`main-content ${isPublicPage ? 'is-public-page' : ''}`}>
        <Outlet />
      </main>
      <WebFooter />
    </div>
  );
};
