import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable, StatCard } from '../../../components/portal/PortalStates';
import { portalService } from '../../../services/portalService';
import React, { useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { FileSpreadsheet, Download } from 'lucide-react';

const PrincipalReports = () => {
  const query = usePortalQuery(() => portalService.getSchoolResults(), []);
  const download = () => {
    const escape = value => '"' + String(value ?? '').replace(/^[=+@-]/, "'").replaceAll('"','""') + '"';
    const rows = [['Class','Subject','Exam','Marks','Maximum'], ...query.data.map(r=>[`${r.students?.classes?.grade_level || ''} ${r.students?.classes?.division || ''}`,r.subjects?.name,r.term,r.marks_obtained,r.max_marks])];
    const url = URL.createObjectURL(new Blob([rows.map(row=>row.map(escape).join(',')).join('\r\n')], {type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='MIS-published-results.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  return <PortalLayout title="Reports"><div className="card-surface p-6 bg-white border border-slate-200 space-y-6"><h2 className="text-xl font-bold text-mis-navy">School Reports</h2><QueryState query={query} />{!query.loading && !query.error && (query.data.length ? <button onClick={download} className="px-4 py-3 rounded-xl bg-mis-navy text-white font-bold text-sm">Download published results (CSV)</button> : <EmptyState>No report data available.</EmptyState>)}<p className="text-xs text-mis-muted">Reports display up to 1,000 authorized records.</p></div></PortalLayout>;
};

export default PrincipalReports;
