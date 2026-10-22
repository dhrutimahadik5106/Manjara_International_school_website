import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable, StatCard } from '../../../components/portal/PortalStates';
import useStudentRecords from '../../../hooks/useStudentRecords';
import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { DollarSign, CheckCircle2, Download, ShieldCheck } from 'lucide-react';

const ParentFees = () => {
  const query = useStudentRecords('getFees');
  const { data: fees, student } = query;
  const money = value => Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  return <PortalLayout title="Child Fee Ledger & Receipts"><div className="space-y-6">
    <div className="card-surface p-6 bg-white border border-slate-200"><h2 className="text-xl font-bold text-mis-navy">Fee Statement</h2><p className="mt-2 text-sm text-mis-muted">{student?.fullName || 'No child selected'} ? {student?.studentId} ? {student?.grade} {student?.division}</p></div>
    <QueryState query={query} />
    {!query.loading && !query.error && <><div className="grid gap-4 sm:grid-cols-3">{[['total_amount','Total fees'],['paid_amount','Paid'],['pending_amount','Pending']].map(([key,label])=><StatCard key={key} label={label} value={fees.length ? money(fees.reduce((n,f)=>n+Number(f[key]),0)) : 'No data available'} />)}</div>
    <DataTable columns={[['academic_year','Academic year'],['total','Total fees'],['paid','Paid'],['pending','Pending'],['status','Status'],['due_date','Due date'],['receipt_ref','Receipt/reference']]} rows={fees.map(f=>({...f,total:money(f.total_amount),paid:money(f.paid_amount),pending:money(f.pending_amount)}))} empty="No fee records available." /></>}
  </div></PortalLayout>;
};

export default ParentFees;
