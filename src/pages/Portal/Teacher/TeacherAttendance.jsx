
import React, { useEffect, useMemo, useState } from 'react';
import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState } from '../../../components/portal/PortalStates';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService, localDate } from '../../../services/portalService';
import {
  CheckCircle2,
  Save,
  RefreshCw,
  Users,
  CalendarX2,
} from 'lucide-react';

const TeacherAttendance = () => {
  const { user } = useAuth();
  const { teacher } = usePortalData();

  const authorizedClasses = teacher?.assignedClasses || [];

  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(localDate());

  const [studentsList, setStudentsList] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const [holidays, setHolidays] = useState([]);
  const [holidaysLoading, setHolidaysLoading] = useState(true);
  const [holidaysError, setHolidaysError] = useState('');

  const selectedClass =
    authorizedClasses.find((c) => c.class_id === classId) ||
    authorizedClasses[0];

  const calendarYear = date.slice(0, 4);

  // Load holidays for the selected year.
  useEffect(() => {
    let cancelled = false;

    const loadHolidays = async () => {
      setHolidaysLoading(true);
      setHolidaysError('');
      setHolidays([]);

      try {
        const data = await portalService.getHolidays(
          null,
          Number(calendarYear)
        );

        if (!cancelled) {
          setHolidays(data || []);
        }
      } catch (error) {
        if (!cancelled) {
          setHolidaysError(
            error?.message || 'Unable to load school holidays.'
          );
        }
      } finally {
        if (!cancelled) {
          setHolidaysLoading(false);
        }
      }
    };

    loadHolidays();

    return () => {
      cancelled = true;
    };
  }, [calendarYear]);

  // Identify weekend and school holiday dates.
  const dateStatus = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        allowed: false,
        reason: 'Select a valid attendance date.',
      };
    }

    const parsed = new Date(`${date}T12:00:00Z`);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    ) {
      return {
        allowed: false,
        reason: 'Invalid attendance date.',
      };
    }

    const day = parsed.getUTCDay();

    if (day === 6) {
      return {
        allowed: false,
        reason: 'Saturday is a weekly school holiday.',
      };
    }

    if (day === 0) {
      return {
        allowed: false,
        reason: 'Sunday is a weekly school holiday.',
      };
    }

    if (holidaysLoading || holidaysError) {
      return {
        allowed: false,
        reason: holidaysError || 'Checking school holidays...',
      };
    }

    const holiday = holidays.find((h) => {
      const start = h.start_date;
      const end = h.end_date || start;

      return (
        date >= start &&
        date <= end &&
        (
          !h.applicable_to ||
          h.applicable_to.includes('student')
        )
      );
    });

    if (holiday) {
      return {
        allowed: false,
        reason: `School holiday: ${holiday.title}`,
      };
    }

    return {
      allowed: true,
      reason: 'School working day — attendance allowed.',
    };
  }, [date, holidays, holidaysLoading, holidaysError]);

  const query = usePortalQuery(
    () =>
      selectedClass
        ? portalService.getAttendance(
            selectedClass.class_id,
            date
          )
        : Promise.resolve([]),
    [selectedClass?.class_id, date]
  );

  const sortedAttendance = useMemo(() => {
    if (!Array.isArray(query.data)) return [];

    return [...query.data].sort((a, b) => {
      const rollA = Number(a.rollNumber ?? a.roll_number);
      const rollB = Number(b.rollNumber ?? b.roll_number);

      return (
        (Number.isFinite(rollA) ? rollA : Infinity) -
        (Number.isFinite(rollB) ? rollB : Infinity)
      );
    });
  }, [query.data]);

  useEffect(() => {
    setStudentsList(sortedAttendance);
    setSavedSuccess(false);
  }, [sortedAttendance]);

  useEffect(() => {
    setSavedSuccess(false);
    setSaveError('');
  }, [selectedClass?.class_id, date]);

  const handleStatusChange = (index, status) => {
    if (!dateStatus.allowed || saving) return;

    setSavedSuccess(false);

    setStudentsList((previous) =>
      previous.map((student, i) =>
        i === index ? { ...student, status } : student
      )
    );
  };

  const handleSaveAttendance = async () => {
    if (
      !selectedClass ||
      !dateStatus.allowed ||
      saving ||
      query.loading ||
      query.error ||
      !studentsList.length
    ) {
      return;
    }

    setSaving(true);
    setSaveError('');
    setSavedSuccess(false);

    try {
      const validStatuses = ['present', 'absent', 'late'];

      if (
        studentsList.some(
          (student) => !validStatuses.includes(student.status)
        )
      ) {
        throw new Error(
          'Please mark Present, Absent or Late for every student.'
        );
      }

      await portalService.saveAttendance(
        selectedClass.class_id,
        date,
        studentsList
      );

      setSavedSuccess(true);
    } catch (error) {
      setSaveError(
        error?.message || 'Unable to save attendance.'
      );
    } finally {
      setSaving(false);
    }
  };

  const presentCount = studentsList.filter(
    (s) => s.status === 'present'
  ).length;

  const absentCount = studentsList.filter(
    (s) => s.status === 'absent'
  ).length;

  const lateCount = studentsList.filter(
    (s) => s.status === 'late'
  ).length;

  return (
    <PortalLayout title="Mark Attendance">
      <div className="space-y-6">

        <div className="card-surface p-6 bg-white border border-slate-200 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Teacher: {user?.fullName || 'Faculty'}
              </span>

              <h2 className="text-xl font-extrabold text-mis-navy mt-3">
                Class Attendance Register
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Monday to Friday, excluding school holidays.
                Students are sorted by roll number.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <label className="text-xs font-bold text-slate-600">
                Assigned Class

                <select
                  value={selectedClass?.class_id || ''}
                  onChange={(e) => setClassId(e.target.value)}
                  disabled={!authorizedClasses.length}
                  className="block mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-mis-navy font-bold"
                >
                  {!authorizedClasses.length && (
                    <option value="">No assigned classes</option>
                  )}

                  {authorizedClasses.map((cls) => (
                    <option
                      key={cls.id || `${cls.class_id}-${cls.subject_id}`}
                      value={cls.class_id}
                    >
                      {cls.grade} - {cls.division}
                      {cls.subject ? ` (${cls.subject})` : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-bold text-slate-600">
                Attendance Date

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-mis-navy font-bold"
                />
              </label>

              <button
                type="button"
                onClick={() => query.reload()}
                disabled={query.loading || saving || !selectedClass}
                className="self-end flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-mis-navy disabled:opacity-50"
              >
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div
          role="status"
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold ${
            dateStatus.allowed
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {dateStatus.allowed ? (
            <CheckCircle2 size={20} />
          ) : (
            <CalendarX2 size={20} />
          )}
          {dateStatus.reason}
        </div>

        {!selectedClass && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            No class assignment found for this teacher.
          </div>
        )}

        <QueryState query={query} />

        {saveError && (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
          >
            {saveError}
          </div>
        )}

        {savedSuccess && (
          <div
            role="status"
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-bold"
          >
            <CheckCircle2 size={18} />
            Attendance saved successfully for {date}.
          </div>
        )}

        {selectedClass && !query.loading && !query.error && (
          <div className="card-surface p-6 bg-white border border-slate-200 rounded-2xl space-y-5">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>
                <h3 className="text-lg font-extrabold text-mis-navy">
                  {selectedClass.grade} — Division {selectedClass.division}
                </h3>

                <p className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Users size={15} />
                  {studentsList.length} students enrolled
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={
                  saving ||
                  !dateStatus.allowed ||
                  !studentsList.length
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Attendance Record'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Total Students', studentsList.length, 'bg-blue-50 text-blue-800'],
                ['Present', presentCount, 'bg-emerald-50 text-emerald-800'],
                ['Absent', absentCount, 'bg-red-50 text-red-800'],
                ['Late', lateCount, 'bg-amber-50 text-amber-800'],
              ].map(([label, count, color]) => (
                <div key={label} className={`rounded-xl p-3 ${color}`}>
                  <p className="text-[11px] font-bold">{label}</p>
                  <p className="text-xl font-extrabold mt-1">{count}</p>
                </div>
              ))}
            </div>

            {studentsList.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No students are enrolled in this class yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase">
                    <tr>
                      <th className="p-3">Roll No.</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Student ID</th>
                      <th className="p-3 text-center">Attendance</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {studentsList.map((student, index) => (
                      <tr
                        key={student.id || student.studentId || index}
                        className="hover:bg-slate-50"
                      >
                        <td className="p-3 font-extrabold text-mis-navy">
                          {student.rollNumber ?? student.roll_number ?? '—'}
                        </td>

                        <td className="p-3 font-bold text-slate-900">
                          {student.studentName ||
                            student.fullName ||
                            student.full_name ||
                            'Name unavailable'}
                        </td>

                        <td className="p-3 text-slate-500">
                          {student.studentId ?? student.student_id ?? '—'}
                        </td>

                        <td className="p-3 text-center">
                          <div className="inline-flex gap-1 bg-slate-100 p-1 rounded-xl">
                            {['present', 'absent', 'late'].map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={!dateStatus.allowed || saving}
                                onClick={() =>
                                  handleStatusChange(index, status)
                                }
                                className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                  student.status === status
                                    ? status === 'present'
                                      ? 'bg-emerald-600 text-white'
                                      : status === 'absent'
                                      ? 'bg-red-600 text-white'
                                      : 'bg-amber-500 text-white'
                                    : 'text-slate-600 hover:bg-white'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default TeacherAttendance;
