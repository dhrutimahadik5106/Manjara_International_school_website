
import React, { useCallback, useEffect, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';

import { supabase } from '../../../services/supabase';
import {
  CalendarCheck,
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

const indiaDate = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

const formatTime = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date(value))
    : '—';

const TeacherMyAttendance = () => {
  const { user } = useAuth();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (teacherError) throw teacherError;

      const { data, error: attendanceError } = await supabase
        .from('staff_attendance')
        .select('*')
        .eq('teacher_id', teacher.id)
        .eq('date', indiaDate())
        .maybeSingle();

      if (attendanceError) throw attendanceError;

      setRecord(data);
    } catch (err) {
      setError(err.message || 'Unable to load attendance.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) loadAttendance();
  }, [user?.id, loadAttendance]);

  const handleAction = async (action) => {
    if (saving) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const functionName =
        action === 'in' ? 'staff_check_in' : 'staff_check_out';

      const { data, error: rpcError } = await supabase.rpc(functionName);

      if (rpcError) throw rpcError;

      setRecord(data);
      setSuccess(
        action === 'in'
          ? 'Check-in recorded successfully!'
          : 'Check-out recorded successfully!'
      );
    } catch (err) {
      setError(err.message || 'Attendance action failed.');
      await loadAttendance();
    } finally {
      setSaving(false);
    }
  };

  const checkedIn = !!record?.check_in_time;
  const checkedOut = !!record?.check_out_time;
  const verified = !!record?.is_verified;

  return (
    <PortalLayout title="My Staff Attendance">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="card-surface bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-mis-navy">
                My Daily Attendance
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {user?.fullName || 'Teacher'} · {indiaDate()}
              </p>
            </div>

            <button
              type="button"
              onClick={loadAttendance}
              disabled={loading || saving}
              className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-surface bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
              <LogIn size={18} />
              Check-In Time
            </div>
            <p className="text-3xl font-extrabold text-mis-navy mt-3">
              {formatTime(record?.check_in_time)}
            </p>
          </div>

          <div className="card-surface bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
              <LogOut size={18} />
              Check-Out Time
            </div>
            <p className="text-3xl font-extrabold text-mis-navy mt-3">
              {formatTime(record?.check_out_time)}
            </p>
          </div>
        </div>

        <div className="card-surface bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-mis-blue" size={22} />
            <h3 className="text-lg font-extrabold text-mis-navy">
              Today's Status
            </h3>
          </div>

          <p className="font-bold text-slate-700">
            {loading
              ? 'Loading...'
              : !record
                ? 'Not checked in'
                : checkedOut
                  ? 'Checked out'
                  : 'Checked in'}
          </p>

          {record && (
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck size={16} />
              {verified ? 'Verified by school management' : 'Pending verification'}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading || saving || checkedIn || !!error}
              onClick={() => handleAction('in')}
              className="flex items-center justify-center gap-2 px-5 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <LogIn size={18} />
              {saving ? 'Processing...' : 'Check In'}
            </button>

            <button
              type="button"
              disabled={loading || saving || !checkedIn || checkedOut || verified || !!error}
              onClick={() => handleAction('out')}
              className="flex items-center justify-center gap-2 px-5 py-4 bg-mis-navy hover:bg-mis-blue text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <LogOut size={18} />
              {saving ? 'Processing...' : 'Check Out'}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Attendance timestamps are recorded by the server.
            The displayed times use Indian Standard Time.
            Weekend and holiday restrictions are enforced by the database.
          </p>
        </div>

      </div>
    </PortalLayout>
  );
};

export default TeacherMyAttendance;
