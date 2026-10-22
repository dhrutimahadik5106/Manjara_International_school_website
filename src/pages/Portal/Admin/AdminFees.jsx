import usePortalQuery from '../../../hooks/usePortalQuery';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import { portalService } from '../../../services/portalService';
import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { DollarSign, Download } from 'lucide-react';

const AdminFees = () => {
  const query = usePortalQuery(() => portalService.getSchoolFees(), []);
  const paid = query.data.reduce((n,f)=>n+Number(f.paid_amount),0);
  const pending = query.data.reduce((n,f)=>n+Number(f.pending_amount),0);
  const money = n=>n.toLocaleString('en-IN',{style:'currency',currency:'INR'});
  if(query.loading || query.error) return <PortalLayout title="Fee Ledger"><QueryState query={query} /></PortalLayout>;
  return (
    <PortalLayout title="Fee Ledger & Revenue Accounting">
      <div className="space-y-6">
        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3">
            Academic Fee Ledger Summary (up to 1,000 authorized records)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-emerald-800 font-bold block">Collected Fees</span>
              <span className="text-2xl font-extrabold text-emerald-700">{query.data.length ? money(paid) : 'No data available'}</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-amber-800 font-bold block">Pending Due</span>
              <span className="text-2xl font-extrabold text-amber-700">{query.data.length ? money(pending) : 'No data available'}</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-blue-800 font-bold block">Collection Rate</span>
              <span className="text-2xl font-extrabold text-mis-navy">{paid+pending ? Math.round(paid/(paid+pending)*100)+'%' : 'No data available'}</span>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminFees;
