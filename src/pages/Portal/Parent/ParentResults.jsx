import useStudentRecords from '../../../hooks/useStudentRecords';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Award, FileText, Download } from 'lucide-react';

const ParentResults = () => {
  const query = useStudentRecords('getStudentResults');
  const { data: results, student } = query;
  const studentId = student?.studentId || 'Not assigned';
  const grade = student?.grade || 'Not assigned';
  const totalObtained = results.reduce((n,r) => n + Number(r.marks), 0);
  const totalMax = results.reduce((n,r) => n + Number(r.maxMarks), 0);
  const percentage = totalMax ? Math.round(totalObtained / totalMax * 100) : null;
  if (query.loading || query.error) return <PortalLayout title="Results"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Child Academic Progress Report">
      <div className="space-y-6">
        {!results.length && <EmptyState>No results records available.</EmptyState>}
        <div className="card-surface p-6 bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-mis-navy">Results by examination term</h2>
            <p className="text-xs text-mis-muted mt-1">Report Card for {student?.fullName || 'No child selected'} ({student?.grade} {student?.division})</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-mis-soft rounded-2xl text-right">
              <span className="text-[11px] font-bold text-mis-blue block">Total Aggregate</span>
              <span className="text-xl font-extrabold text-mis-navy">{percentage === null ? 'No data available' : percentage + '%'}</span>
            </div>
            <button onClick={() => window.print()} className="px-4 py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow">
              <Download size={15} /> Print Report Card
            </button>
          </div>
        </div>

        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Marks Obtained</th>
                  <th className="p-3">Max Marks</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {results?.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-mis-navy">{s.subject}</td>
                    <td className="p-3 text-slate-500">{s.code}</td>
                    <td className="p-3 text-emerald-700 font-extrabold">{s.marks}</td>
                    <td className="p-3">{s.maxMarks}</td>
                    <td className="p-3 font-bold text-mis-blue">{s.grade}</td>
                    <td className="p-3 text-slate-600">{s.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ParentResults;
