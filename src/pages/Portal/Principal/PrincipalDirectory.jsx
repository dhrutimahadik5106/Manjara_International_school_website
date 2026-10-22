import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable, StatCard } from '../../../components/portal/PortalStates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Users, GraduationCap } from 'lucide-react';

const PrincipalDirectory = () => {
  const [search, setSearch] = useState('');
  const query = usePortalQuery(async()=>{ const [students, teachers] = await Promise.all([portalService.getStudents(), portalService.getTeachers()]); return { students, teachers }; }, [], { students:[], teachers:[] });
  const students = query.data.students.filter(s=>`${s.fullName} ${s.grade} ${s.studentId}`.toLowerCase().includes(search.toLowerCase()));
  const teachers = query.data.teachers.filter(t=>`${t.fullName} ${t.email} ${t.specialization}`.toLowerCase().includes(search.toLowerCase()));
  if (query.loading || query.error) return <PortalLayout title="School Directory"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Institutional School Directory">
      <div className="space-y-6">
        <input aria-label="Search school directory" placeholder="Search name, class, student ID or email" value={search} onChange={e=>setSearch(e.target.value)} className="w-full rounded-xl p-3 border border-slate-200 text-sm" />
        {!students.length && !teachers.length && <EmptyState>No matching records available.</EmptyState>}
        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3 flex items-center gap-2">
            <GraduationCap size={18} className="text-mis-blue" />
            Faculty & Teaching Staff Directory ({teachers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Faculty Name</th>
                  <th className="p-3">Official Email</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3">Qualification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {teachers.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-mis-navy">{t.employeeId}</td>
                    <td className="p-3 font-bold text-slate-900">{t.fullName}</td>
                    <td className="p-3 text-mis-blue">{t.email}</td>
                    <td className="p-3 text-emerald-700">{t.specialization}</td>
                    <td className="p-3 text-slate-600">{t.qualification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users size={18} className="text-mis-gold" />
            Student Master Roster ({students.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Grade & Division</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Parent Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {students.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-mis-navy">{st.studentId}</td>
                    <td className="p-3 font-bold text-slate-900">{st.fullName}</td>
                    <td className="p-3 text-mis-blue">{st.grade} - Division {st.division}</td>
                    <td className="p-3 font-extrabold">{st.rollNumber}</td>
                    <td className="p-3 text-slate-600">{st.phone}</td>
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

export default PrincipalDirectory;
