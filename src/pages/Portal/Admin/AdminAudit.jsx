import usePortalQuery from '../../../hooks/usePortalQuery';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import AccountCredentials from '../../../components/portal/AccountCredentials';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { ShieldCheck, Lock } from 'lucide-react';

const AdminAudit = () => {
  const query = usePortalQuery(() => portalService.getAuditLogs(), []);
  const logs = query.data;
  if(query.loading || query.error) return <PortalLayout title="Audit Logs"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="System Security & Audit Logs">
      <div className="space-y-6">
        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-mis-blue" />
            Security Log Stream
          </h3>

          <div className="space-y-2.5">
            {logs.map((l) => (
              <div key={l.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-mis-navy">{l.action}</span>
                  <p className="text-slate-600 mt-0.5">{l.details}</p>
                  <div className="text-[10px] text-slate-400 mt-1">User Identity: {l.username}</div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{l.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminAudit;
