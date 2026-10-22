import useStudentRecords from '../../../hooks/useStudentRecords';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Clock } from 'lucide-react';

const ParentTimetable = () => {
  const query = useStudentRecords('getStudentTimetable');
  const { data: timetable, student } = query;
  const studentId = student?.studentId || 'Not assigned';
  const grade = student?.grade || 'Not assigned';
  if (query.loading || query.error) return <PortalLayout title="Timetable"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Child Class Timetable">
      <div className="space-y-6">
        {!timetable.length && <EmptyState>No timetable records available.</EmptyState>}
        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3">
            Weekly Schedule - {student?.grade} {student?.division}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Timing</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Faculty</th>
                  <th className="p-3">Classroom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {timetable.map((slot, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-mis-navy">{slot.day_of_week}</td>
                    <td className="p-3 font-bold text-mis-blue">{i + 1}</td>
                    <td className="p-3 text-slate-500">{slot.start_time} ? {slot.end_time}</td>
                    <td className="p-3 text-slate-900 font-bold">{slot.subjects?.name}</td>
                    <td className="p-3">{slot.teachers?.profiles?.full_name}</td>
                    <td className="p-3 text-slate-600">{slot.room_number}</td>
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

export default ParentTimetable;
