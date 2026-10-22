import useStudentRecords from '../../../hooks/useStudentRecords';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { CalendarCheck, CheckCircle2, Clock, XCircle } from 'lucide-react';

const ParentAttendance = () => {
  const query = useStudentRecords('getStudentAttendance');
  const { data: attendance, student } = query;
  const studentId = student?.studentId || 'Not assigned';
  const grade = student?.grade || 'Not assigned';
  const total = attendance.length;
  const present = attendance.filter(r=>r.status==='present').length;
  const late = attendance.filter(r=>r.status==='late').length;
  const absent = attendance.filter(r=>r.status==='absent').length;
  if (query.loading || query.error) return <PortalLayout title="Attendance"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Child Attendance Tracker">
      <div className="space-y-6">
        {!attendance.length && <EmptyState>No attendance records available.</EmptyState>}
        <div className="card-surface p-6 bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-mis-navy">{student?.fullName || 'No child selected'} - {student?.grade} {student?.division}</h2>
            <p className="text-xs text-mis-muted mt-1">Real-time attendance register updated daily by class teachers.</p>
          </div>
          <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-emerald-800 block">Overall Percentage</span>
            <span className="text-3xl font-extrabold text-emerald-700">{total ? Math.round((present + late) / total * 100) + '%' : 'No data available'}</span>
          </div>
        </div>

        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-sm font-extrabold text-mis-navy uppercase tracking-wider border-b border-slate-100 pb-2">
            Recent Attendance Log
          </h3>

          <div className="space-y-2">
            {attendance?.map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${r.status === 'present' ? 'bg-emerald-100 text-emerald-800' : r.status === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                    {r.status === 'present' ? <CheckCircle2 size={16} /> : r.status === 'late' ? <Clock size={16} /> : <XCircle size={16} />}
                  </span>
                  <div>
                    <span className="font-bold text-mis-navy block">{r.date}</span>
                    <span className="text-slate-500">{r.subject}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[11px] ${r.status === 'present' ? 'bg-emerald-100 text-emerald-800' : r.status === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ParentAttendance;
