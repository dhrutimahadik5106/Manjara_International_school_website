import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, StatCard } from '../../../components/portal/PortalStates';
import RecentPortalUpdates from '../../../components/portal/RecentPortalUpdates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import {
  CalendarCheck,
  BookOpen,
  Award,
  Bell,
  Clock,
  ArrowRight,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { student } = usePortalData();
  const studentId = student?.studentId || 'Not assigned';
  const query = usePortalQuery(async () => {
    if (!student) return { attendance: [], assignments: [], timetable: [], notices: [], results: [] };
    const [attendance, assignments, timetable, notices, results] = await Promise.all([
      portalService.getStudentAttendance(student.id), portalService.getStudentAssignments(student.id), portalService.getStudentTimetable(student.id), portalService.getStudentNotices(), portalService.getStudentResults(student.id)]);
    return { attendance, assignments, timetable, notices, results };
  }, [student?.id], { attendance: [], assignments: [], timetable: [], notices: [], results: [] });
  const { attendance, assignments, timetable, notices, results } = query.data;
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => ['present','late'].includes(a.status)).length;
  const attendancePercentage = totalDays ? Math.round(presentDays / totalDays * 100) + '%' : 'No data available';
  const pendingAssignments = assignments.filter(a => ['pending','late'].includes(a.status));
  const maxMarks = results.reduce((n,r)=>n+Number(r.maxMarks),0);
  const aggregate = maxMarks ? Math.round(results.reduce((n,r)=>n+Number(r.marks),0)/maxMarks*100)+'%' : 'No data available';
  if (query.loading || query.error) return <PortalLayout title="Student Dashboard"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Student Dashboard">
      <div className="space-y-6">
        {/* Personalized Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-mis-navy via-mis-blue-dark to-mis-blue p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-mis-gold text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
              <Sparkles size={14} />
              Official MIS Student Academic Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Student'}!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
              Student ID: <span className="font-bold text-mis-gold font-mono">{studentId}</span> | Class: <span className="font-bold text-white">{student?.grade || 'Not assigned'}-{student?.division || ''}</span> | Roll No: <span className="font-bold text-white">{student?.rollNumber ?? 'Not assigned'}</span>
            </p>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Attendance Rate</p>
              <h3 className="text-2xl font-extrabold text-mis-navy mt-1">{attendancePercentage}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{presentDays} of {totalDays} Sessions</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarCheck size={24} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Pending Tasks</p>
              <h3 className="text-2xl font-extrabold text-mis-navy mt-1">{pendingAssignments.length}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Pending or overdue</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
              <BookOpen size={24} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Published Results Aggregate</p>
              <h3 className="text-2xl font-extrabold text-mis-navy mt-1">{aggregate}</h3>
              <p className="text-[11px] text-mis-blue font-semibold mt-0.5">Across available results</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 text-mis-blue">
              <Award size={24} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Active Notices</p>
              <h3 className="text-2xl font-extrabold text-mis-navy mt-1">{notices.length}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-0.5">School circulars</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
              <Bell size={24} />
            </div>
          </div>
        </div>

        {/* Two Column Layout: Assignments & Today's Schedule */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Active Assignments */}
          <div className="lg:col-span-7 card-surface p-6 bg-white border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-mis-navy flex items-center gap-2">
                <BookOpen size={18} className="text-mis-blue" />
                Current Assignments
              </h3>
              <Link to="/portal/student/assignments" className="text-xs font-bold text-mis-blue hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {!assignments.length && <EmptyState>No assignments yet.</EmptyState>}
              {assignments.slice(0,4).map(asg => (
                <div key={asg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-mis-soft text-mis-blue text-[10px] font-bold uppercase mb-1">
                      {asg.subject}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-mis-navy">{asg.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Due: {asg.dueDate} | {asg.teacherName}</p>
                  </div>
                  <span className={`self-start sm:self-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                    asg.status === 'submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="lg:col-span-5 card-surface p-6 bg-white border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-mis-navy flex items-center gap-2">
                <Clock size={18} className="text-mis-gold" />
                Class Schedule
              </h3>
              <Link to="/portal/student/timetable" className="text-xs font-bold text-mis-blue hover:underline">
                Full Timetable
              </Link>
            </div>

            <div className="space-y-3">
              {!timetable.length && <EmptyState>No classes scheduled.</EmptyState>}
              {timetable.slice(0,4).map((tt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full bg-mis-blue shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-mis-navy truncate">{tt.subjects?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{tt.teachers?.profiles?.full_name} | {tt.room_number}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                    {tt.day_of_week} {tt.start_time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <RecentPortalUpdates />
      </div>
    </PortalLayout>
  );
};

export default StudentDashboard;
