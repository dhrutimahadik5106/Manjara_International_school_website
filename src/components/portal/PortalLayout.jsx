import { usePortalData } from '../../context/PortalDataContext';
import { QueryState } from './PortalStates';
import React, { useState } from 'react';
import PortalHeader from './PortalHeader';
import PortalSidebar from './PortalSidebar';

const PortalLayout = ({ title, children }) => {
  const scope = usePortalData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <PortalSidebar />
      </div>

      {/* Mobile Slide-out Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full">
            <PortalSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <PortalHeader title={title} onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <QueryState query={scope} />
          {!scope.loading && !scope.error && children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
