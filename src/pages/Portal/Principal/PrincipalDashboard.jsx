import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, StatCard } from '../../../components/portal/PortalStates';
import RecentPortalUpdates from '../../../components/portal/RecentPortalUpdates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import { Award, Users, GraduationCap, CalendarCheck, ShieldCheck, FileSpreadsheet } from 'lucide-react';

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const query = usePortalQuery(() => portalService.getSchoolOverview(), [user?.id], null);
  if (query.loading || query.error) return <PortalLayout title="Principal Dashboard"><QueryState query={query} /></PortalLayout>;
  const data = query.data;
  const attendance = data.attendance.length ? Math.round(data.attendance.filter(a=>['present','late'].includes(a.status)).length / data.attendance.length * 100) + '%' : 'No data available';
  const maxMarks = data.results.reduce((n,r)=>n+Number(r.max_marks),0);
  const aggregate = maxMarks ? Math.round(data.results.reduce((n,r)=>n+Number(r.marks_obtained),0)/maxMarks*100)+'%' : 'No data available';

  return (
    <PortalLayout title="Principal & Institutional Leadership Portal">
      <div className="space-y-6">
        <div className="card-surface p-6 bg-gradient-to-r from-mis-navy to-mis-blue text-white rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-mis-gold text-xs font-bold uppercase mb-2">
              <Award size={14} /> Institutional Leadership Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Welcome, {user?.fullName || 'Principal'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Manjara International School — Academic Oversight & Compliance Portal
            </p>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Enrolled Students</div>
              <div className="text-2xl font-extrabold text-mis-navy mt-1">{data.students}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">Active Roster</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 text-mis-blue">
              <Users size={26} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Faculty & Staff</div>
              <div className="text-2xl font-extrabold text-mis-navy mt-1">{data.teachers}</div>
              <div className="text-[11px] text-mis-blue font-bold mt-1">Teacher records</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
              <GraduationCap size={26} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Daily Attendance</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{attendance}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">School-wide Today</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarCheck size={26} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Recorded Results Aggregate</div>
              <div className="text-2xl font-extrabold text-mis-navy mt-1">{aggregate}</div>
              <div className="text-[11px] text-mis-gold font-bold mt-1">Available published marks</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
              <Award size={26} />
            </div>
          </div>
        </div>
        <RecentPortalUpdates />
      </div>
    </PortalLayout>
  );
};

export default PrincipalDashboard;
