import usePortalQuery from '../../../hooks/usePortalQuery';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import AccountCredentials from '../../../components/portal/AccountCredentials';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  ShieldCheck,
  DollarSign,
  Plus,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const query = usePortalQuery(async()=>{const [students,teachers,logs,classes] = await Promise.all([portalService.getStudents(),portalService.getTeachers(),portalService.getAuditLogs(),portalService.getClasses()]);return {students,teachers,logs,classes};},[],{students:[],teachers:[],logs:[],classes:[]});
  const { students, teachers, logs, classes } = query.data;
  if (query.loading || query.error) return <PortalLayout title="Administration"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="IT & Administrative Management Portal">
      <div className="space-y-6">
        <div className="card-surface p-6 bg-gradient-to-r from-mis-navy to-mis-blue text-white rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-mis-gold text-xs font-bold uppercase mb-2">
              <ShieldCheck size={14} /> System IT Administration
            </div>
            <h2 className="text-3xl font-extrabold text-white">
  MIS Central School Administration
</h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Provision student credentials, teacher official email accounts, class assignments, and manage school calendars without source code changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/portal/admin/students"
              className="px-4 py-2.5 bg-mis-gold hover:bg-amber-400 text-mis-navy text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Student
            </Link>
            <Link
              to="/portal/admin/teachers"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-white/20"
            >
              <Plus size={16} /> Add Teacher
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Provisioned Students</div>
              <div className="text-2xl font-extrabold text-mis-navy mt-1">{students.length}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">Student records</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 text-mis-blue">
              <Users size={26} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Provisioned Faculty</div>
              <div className="text-2xl font-extrabold text-mis-navy mt-1">{teachers.length}</div>
              <div className="text-[11px] text-mis-blue font-bold mt-1">Teacher records</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
              <GraduationCap size={26} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Classes & Divisions</div>
              <div className="text-2xl font-extrabold text-mis-navy mt-1">{classes.length}</div>
              <div className="text-[11px] text-purple-600 font-bold mt-1">Configured classes</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
              <Layers size={26} />
            </div>
          </div>

          <div className="card-surface p-5 bg-white border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">School Calendar</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">View calendar</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">Authoritative Holidays</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarCheck size={26} />
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        
<div className="card-surface p-6 mb-6 bg-white border border-slate-200/90 rounded-2xl">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h3 className="text-lg font-extrabold text-mis-navy">
        Admission Enquiries Management
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        View parent enquiries, contact families, and track admission progress.
      </p>
    </div>

    <Link
      to="/portal/admin/enquiries"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-mis-navy text-white px-5 py-3 text-sm font-bold hover:bg-mis-blue transition"
    >
      View Admission Enquiries
      <ArrowRight size={16} />
    </Link>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-3">
            <div className="p-3 bg-blue-50 text-mis-blue rounded-2xl w-max">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-mis-navy">Student Account Provisioning</h3>
            <p className="text-xs text-mis-muted leading-relaxed">
              Add new student profiles, assign Student IDs, roll numbers, class & division, and manage their school accounts.
            </p>
            <Link
              to="/portal/admin/students"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-mis-blue hover:underline pt-2"
            >
              Open Student Management <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-max">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-mis-navy">Teacher Official Email Provisioning</h3>
            <p className="text-xs text-mis-muted leading-relaxed">
              Create teacher accounts using official school domain emails and assign class/subject permissions.
            </p>
            <Link
              to="/portal/admin/teachers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-mis-blue hover:underline pt-2"
            >
              Open Teacher Management <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-max">
              <CalendarCheck size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-mis-navy">Holiday & Calendar Admin</h3>
            <p className="text-xs text-mis-muted leading-relaxed">
              Configure Indian national holidays, Maharashtra state holidays, and future academic year calendars.
            </p>
            <Link
              to="/portal/admin/calendar"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-mis-blue hover:underline pt-2"
            >
              Manage School Calendar <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-3">
          <h3 className="text-sm font-extrabold text-mis-navy uppercase tracking-wider border-b border-slate-100 pb-2">
            Recent System Security & Audit Log
          </h3>
          <div className="space-y-2 text-xs">
            {!logs.length && <EmptyState>No audit records available.</EmptyState>}
            {logs.slice(0, 5).map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-mis-navy">{log.action}</span> — <span className="text-slate-600">{log.details}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">By: {log.username}</div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
