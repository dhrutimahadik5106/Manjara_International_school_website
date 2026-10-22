import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable } from '../../../components/portal/PortalStates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { GraduationCap, Users } from 'lucide-react';

const TeacherClasses = () => {
  const query = usePortalQuery(() => portalService.getStudents(), []);
  const students = query.data;
  const { teacher } = usePortalData();
  if (query.loading || query.error) return <PortalLayout title="Classes"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Assigned Classes & Student Roster">
      <div className="space-y-6">
        {!students.length && <EmptyState>No classes records available.</EmptyState>}
        <DataTable columns={[['grade','Class'],['division','Division'],['subject','Subject'],['academicYear','Academic year']]} rows={teacher?.assignedClasses || []} empty="No assigned classes." />
        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3">
            Students in your assigned classes
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {students.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-extrabold text-mis-navy">{st.rollNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{st.fullName}</td>
                    <td className="p-3 text-mis-blue">{st.studentId}</td>
                    <td className="p-3 text-slate-600">{st.grade} {st.division}</td>
                    <td className="p-3 text-slate-500">{st.phone}</td>
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

export default TeacherClasses;
