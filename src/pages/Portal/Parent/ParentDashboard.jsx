import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, StatCard } from '../../../components/portal/PortalStates';
import RecentPortalUpdates from '../../../components/portal/RecentPortalUpdates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import {
  Users,
  CalendarCheck,
  Award,
  DollarSign,
  BookOpen,
  Bell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { students, student: selectedStudent, selectChild } = usePortalData();
  const query = usePortalQuery(async () => {
    if (!selectedStudent) return { attendance: [], assignments: [], fees: [] };
    const [attendance, assignments, fees] = await Promise.all([portalService.getStudentAttendance(selectedStudent.id), portalService.getStudentAssignments(selectedStudent.id), portalService.getFees(selectedStudent.id)]);
    return { attendance, assignments, fees };
  }, [selectedStudent?.id], { attendance: [], assignments: [], fees: [] });
  const { attendance, assignments, fees } = query.data;
  const summary = { attendancePercentage: attendance.length ? Math.round(attendance.filter(a=>['present','late'].includes(a.status)).length / attendance.length * 100) + '%' : 'No data available', pendingAssignmentsCount: assignments.filter(a=>['pending','late'].includes(a.status)).length };
  const handleChildSelect = (student) => selectChild(student.id);
  if (query.loading || query.error) return <PortalLayout title="Parent Dashboard"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Parent Portal Dashboard">
      <div className="space-y-6">
        {/* Child Selector Banner */}
        <div className="card-surface p-6 bg-gradient-to-r from-mis-navy to-mis-blue text-white rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-mis-gold text-xs font-bold uppercase mb-2">
              <Users size={14} /> Linked Child Accounts
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Welcome, {user?.fullName || 'Parent'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Select your child below to view attendance, performance, fee statements, and teacher remarks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-xs font-bold text-slate-200 pl-2">Active Child:</span>
            <select
              value={selectedStudent?.id ?? 'Not available'}
              onChange={(e) => {
                const s = students.find(item => item.id === e.target.value);
                if (s) handleChildSelect(s);
              }}
              className="bg-mis-navy text-white text-xs font-bold py-2 px-3 rounded-xl border border-white/20 outline-none cursor-pointer"
            >
              {students.map(st => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.grade || 'Not assigned'}-{st.division || ''})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Child Overview Cards */}
        {selectedStudent && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</div>
                <div className="text-2xl font-extrabold text-mis-navy mt-1">
                  {summary.attendancePercentage}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">Good Record</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <CalendarCheck size={26} />
              </div>
            </div>

            <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Children</div>
                <div className="text-2xl font-extrabold text-mis-navy mt-1">{students.length}</div>
                <div className="text-[11px] text-mis-blue font-bold mt-1">Authorized child accounts</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 text-mis-blue">
                <Award size={26} />
              </div>
            </div>

            <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</div>
                <div className="text-2xl font-extrabold text-mis-navy mt-1">
                  {summary.pendingAssignmentsCount}
                </div>
                <div className="text-[11px] text-amber-600 font-bold mt-1">Pending or overdue</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
                <BookOpen size={26} />
              </div>
            </div>

            <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Status</div>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">{fees[0]?.status || 'No data available'}</div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">{fees[0]?.academic_year || 'No fee records'}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <DollarSign size={26} />
              </div>
            </div>
          </div>
        )}

        {/* Selected Child Info & Upcoming Holiday */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-surface p-6 bg-white border border-slate-200/90 space-y-4">
            <h3 className="text-base font-extrabold text-mis-navy border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Student Academic Profile — {selectedStudent?.fullName}</span>
              <span className="text-xs font-bold text-mis-blue px-3 py-1 bg-mis-soft rounded-full">
                ID: {selectedStudent?.studentId ?? 'Not available'}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-semibold mb-0.5">Grade & Division</span>
                <strong className="text-mis-navy text-sm font-extrabold">
                  {selectedStudent?.grade ?? 'Not available'} - {selectedStudent?.division ?? 'Not available'}
                </strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-semibold mb-0.5">Roll Number</span>
                <strong className="text-mis-navy text-sm font-extrabold">
                  {selectedStudent?.rollNumber ?? 'Not available'}
                </strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-semibold mb-0.5">Blood Group</span>
                <strong className="text-mis-navy text-sm font-extrabold">
                  {selectedStudent?.bloodGroup ?? 'Not available'}
                </strong>
              </div>
            </div>
          </div>

          <StatCard label="Pending fees" value={fees.length ? fees.reduce((sum,f)=>sum+Number(f.pending_amount),0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'No data available'} />
        </div>
        {!students.length && <EmptyState>No children are linked to your account. Please contact the school.</EmptyState>}
        <RecentPortalUpdates />
      </div>
    </PortalLayout>
  );
};

export default ParentDashboard;
