import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, StatCard } from '../../../components/portal/PortalStates';
import RecentPortalUpdates from '../../../components/portal/RecentPortalUpdates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CalendarCheck,
  BookOpen,
  FolderOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { teacher: currentTeacher } = usePortalData();
  const assignedClasses = currentTeacher?.assignedClasses || [];
  const query = usePortalQuery(() => portalService.getTeacherTimetable(), [user?.id]);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <PortalLayout title="Teacher & Faculty Portal">
      <div className="space-y-6">
        {/* Banner with Official School Email Badge */}
        <div className="card-surface p-6 bg-gradient-to-r from-mis-navy to-mis-blue text-white rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-mis-gold text-xs font-bold uppercase mb-2">
              <ShieldCheck size={14} /> Official School Email Account
            </div>
            <h2 className="text-3xl font-extrabold text-white">
  Welcome, {user?.fullName}
</h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Official Email: <span className="font-bold underline text-white">{user?.email || ''}</span>
            </p>
          </div>

          <Link
            to="/portal/teacher/attendance"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-mis-gold hover:bg-amber-400 text-mis-navy text-xs font-bold rounded-xl transition shadow"
          >
            <CalendarCheck size={16} />
            Mark Today's Attendance
          </Link>
        </div>

        {/* Authorized Class Assignments Grid */}
        <div className="card-surface p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div>
    <h3 className="text-lg font-extrabold text-mis-navy">
      My Staff Attendance
    </h3>
    <p className="text-sm text-slate-500 mt-1">
      Record your daily check-in and check-out.
    </p>
  </div>

  <Link
    to="/portal/teacher/my-attendance"
    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
  >
    <Clock size={18} />
    My Check-In / Check-Out
  </Link>
</div>
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-mis-navy uppercase tracking-wider">
            Your Authorized Class & Subject Assignments ({assignedClasses.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedClasses.map((cls, idx) => (
              <div key={idx} className="card-surface p-5 bg-white border border-slate-200/90 flex flex-col justify-between space-y-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-mis-soft text-mis-blue text-[11px] font-bold uppercase">
                    {cls.subject}
                  </span>
                  <h4 className="text-xl font-extrabold text-mis-navy mt-2">
                    {cls.grade} — Division {cls.division}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Authorized for attendance & assignment creation.</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to="/portal/teacher/attendance"
                    className="flex-1 text-center py-2 px-3 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition"
                  >
                    Attendance
                  </Link>
                  <Link
                    to="/portal/teacher/assignments"
                    className="flex-1 text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    Assignments
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!assignedClasses.length && <EmptyState>No classes have been assigned to you.</EmptyState>}
        <QueryState query={query} />
        <section className="card-surface bg-white p-5 border border-slate-200"><h3 className="font-bold text-mis-navy">Today's classes</h3>{query.data.filter(t=>t.day_of_week===today).map(t=><p key={t.id} className="mt-3 text-sm">{t.start_time} ? {t.subjects?.name} ? {t.classes?.grade_level} {t.classes?.division}</p>)}{!query.loading && !query.error && !query.data.some(t=>t.day_of_week===today) && <EmptyState>No classes scheduled today.</EmptyState>}</section>
        <RecentPortalUpdates />
      </div>
    </PortalLayout>
  );
};

export default TeacherDashboard;
