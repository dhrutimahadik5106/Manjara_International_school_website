
import React, { useEffect, useMemo, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { supabase } from '../../../services/supabase';
import {
  CalendarCheck,
  GraduationCap,
  Users,
  RefreshCw
} from 'lucide-react';

const todayIST = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const get = (type) => parts.find(p => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};

const timeIST = (value) =>
  value
    ? new Date(value).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '—';

const duration = (start, end) => {
  if (!start || !end) return '—';

  const minutes = Math.max(
    0,
    Math.floor(
      (new Date(end).getTime() - new Date(start).getTime()) / 60000
    )
  );

  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const PrincipalAttendance = () => {
  const [tab, setTab] = useState('staff');
  const [date, setDate] = useState(todayIST());

  const [teachers, setTeachers] = useState([]);
  const [staffRecords, setStaffRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentRecords, setStudentRecords] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        if (tab === 'staff') {
          const [teacherList, attendanceResult] = await Promise.all([
            portalService.getTeachers(),
            supabase
              .from('staff_attendance')
              .select(
                'id,teacher_id,date,status,check_in_time,check_out_time,is_verified,remarks'
              )
              .eq('date', date)
              .limit(1000)
          ]);

          if (attendanceResult.error) {
            throw attendanceResult.error;
          }

          if (!active) return;
          setTeachers(teacherList);
          setStaffRecords(attendanceResult.data || []);
        } else {
          const [classList, studentList, attendanceResult] =
            await Promise.all([
              portalService.getClasses(),
              supabase
                .from('students')
                .select(
                  'id,class_id,roll_number,student_id,profiles!students_user_id_fkey(full_name)'
                )
                .limit(1000),
              supabase
                .from('attendance')
                .select('id,student_id,class_id,status,date')
                .eq('date', date)
                .limit(1000)
            ]);

          if (studentList.error) throw studentList.error;
          if (attendanceResult.error) throw attendanceResult.error;

          if (!active) return;

          setClasses(classList);
          setStudents(studentList.data || []);
          setStudentRecords(attendanceResult.data || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load attendance.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [tab, date, refreshKey]);

  const staffRows = useMemo(() => {
    return teachers.map(teacher => {
      const record = staffRecords.find(
        row => row.teacher_id === teacher.id
      );

      const minutes = record?.check_in_time && record?.check_out_time
        ? (
            new Date(record.check_out_time) -
            new Date(record.check_in_time)
          ) / 60000
        : null;

      return {
        id: teacher.id,
        name: teacher.fullName || 'Unknown Teacher',
        employeeId: teacher.employeeId || '—',
        checkIn: timeIST(record?.check_in_time),
        checkOut: timeIST(record?.check_out_time),
        hours: duration(
          record?.check_in_time,
          record?.check_out_time
        ),
        status: !record
          ? 'Not recorded'
          : record.status,
        verification: !record
          ? '—'
          : record.is_verified
            ? 'Verified'
            : 'Pending',
        shortHours: minutes !== null && minutes < 360
      };
    });
  }, [teachers, staffRecords]);

  const classRows = useMemo(() => {
    return classes.map(cls => {
      const classStudents = students.filter(
        student => student.class_id === cls.id
      );

      const records = studentRecords.filter(
        row => row.class_id === cls.id
      );

      const present = records.filter(
        row => row.status === 'present'
      ).length;

      const late = records.filter(
        row => row.status === 'late'
      ).length;

      const absent = records.filter(
        row => row.status === 'absent'
      ).length;

      const recorded = new Set(
        records.map(row => row.student_id)
      ).size;

      const total = classStudents.length;

      return {
        id: cls.id,
        name: `${cls.grade_level} - ${cls.division}`,
        total,
        recorded,
        present,
        late,
        absent,
        missing: Math.max(0, total - recorded),
        percentage: recorded
          ? `${Math.round((present + late) / recorded * 100)}%`
          : '—'
      };
    });
  }, [classes, students, studentRecords]);

  const individualRows = useMemo(() => {
    return students
      .filter(student => student.class_id === selectedClass)
      .map(student => {
        const record = studentRecords.find(
          row => row.student_id === student.id
        );

        return {
          id: student.id,
          roll: student.roll_number ?? '—',
          name: student.profiles?.full_name || 'Unknown Student',
          studentId: student.student_id || '—',
          status: record?.status || 'Not marked'
        };
      })
      .sort((a, b) => Number(a.roll) - Number(b.roll));
  }, [students, studentRecords, selectedClass]);

  const pendingCount = staffRows.filter(
    row => row.verification === 'Pending'
  ).length;

  return (
    <PortalLayout title="Attendance Management">
      <div className="space-y-6">

        <div className="card-surface bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-2xl font-extrabold text-mis-navy">
            School Attendance Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Monitor student and staff attendance.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => setTab('staff')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold ${
                tab === 'staff'
                  ? 'bg-mis-navy text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Users size={18} />
              Staff Attendance
            </button>

            <button
              onClick={() => setTab('students')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold ${
                tab === 'students'
                  ? 'bg-mis-navy text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <GraduationCap size={18} />
              Student Attendance
            </button>
          </div>
        </div>

        <div className="card-surface bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-end justify-between gap-4">
          <label className="text-sm font-bold text-mis-navy">
            Attendance Date
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="block mt-2 p-3 border border-slate-200 rounded-xl"
            />
          </label>

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-bold"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-slate-500">Loading attendance...</p>
        )}

        {!loading && !error && tab === 'staff' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                ['Total Teachers', staffRows.length],
                ['Recorded', staffRows.filter(r => r.status !== 'Not recorded').length],
                ['Pending Verification', pendingCount]
              ].map(([label, value]) => (
                <div key={label} className="card-surface bg-white border border-slate-200 p-5 rounded-2xl">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="text-3xl font-extrabold text-mis-navy mt-2">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="card-surface bg-white border border-slate-200 p-5 rounded-2xl overflow-x-auto">
              <h3 className="text-lg font-extrabold text-mis-navy mb-4">
                Teacher Attendance Register
              </h3>

              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100">
                  <tr>
                    {[
                      'Teacher', 'Employee ID', 'Check In',
                      'Check Out', 'Hours', 'Status', 'Verification'
                    ].map(h => (
                      <th key={h} className="p-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {staffRows.map(row => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="p-3 font-bold">{row.name}</td>
                      <td className="p-3">{row.employeeId}</td>
                      <td className="p-3 whitespace-nowrap">{row.checkIn}</td>
                      <td className="p-3 whitespace-nowrap">{row.checkOut}</td>
                      <td className="p-3 whitespace-nowrap">
                        {row.hours}
                        {row.shortHours && (
                          <span className="block text-xs text-amber-700">
                            Under 6 hours — review
                          </span>
                        )}
                      </td>
                      <td className="p-3 capitalize">{row.status}</td>
                      <td className="p-3">{row.verification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!staffRows.length && (
                <p className="p-4 text-slate-500">No teachers found.</p>
              )}
            </div>
          </>
        )}

        {!loading && !error && tab === 'students' && (
          <>
            <div className="card-surface bg-white border border-slate-200 p-5 rounded-2xl overflow-x-auto">
              <h3 className="text-lg font-extrabold text-mis-navy mb-4">
                Class-wise Student Attendance
              </h3>

              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100">
                  <tr>
                    {[
                      'Class', 'Students', 'Recorded', 'Present',
                      'Absent', 'Late', 'Not Marked', 'Attendance'
                    ].map(h => (
                      <th key={h} className="p-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {classRows.map(row => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedClass(row.id)}
                      className="border-b border-slate-100 cursor-pointer hover:bg-slate-50"
                    >
                      <td className="p-3 font-bold">{row.name}</td>
                      <td className="p-3">{row.total}</td>
                      <td className="p-3">{row.recorded}</td>
                      <td className="p-3">{row.present}</td>
                      <td className="p-3">{row.absent}</td>
                      <td className="p-3">{row.late}</td>
                      <td className="p-3">{row.missing}</td>
                      <td className="p-3 font-bold">{row.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!classRows.length && (
                <p className="p-4 text-slate-500">No classes found.</p>
              )}

              <p className="text-xs text-slate-500 mt-4">
                Click a class to see individual students.
                Attendance percentage uses recorded students only.
              </p>
            </div>

            {selectedClass && (
              <div className="card-surface bg-white border border-slate-200 p-5 rounded-2xl overflow-x-auto">
                <h3 className="text-lg font-extrabold text-mis-navy mb-4">
                  Individual Student Attendance
                </h3>

                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      {['Roll No.', 'Student', 'Student ID', 'Status'].map(h => (
                        <th key={h} className="p-3">{h}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {individualRows.map(row => (
                      <tr key={row.id} className="border-b border-slate-100">
                        <td className="p-3">{row.roll}</td>
                        <td className="p-3 font-bold">{row.name}</td>
                        <td className="p-3">{row.studentId}</td>
                        <td className="p-3 capitalize">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!individualRows.length && (
                  <p className="p-4 text-slate-500">
                    No students found for this class.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <p className="text-xs text-slate-500">
          Reports currently load up to 1,000 records per query.
          Staff attendance verification will be added next.
        </p>

      </div>
    </PortalLayout>
  );
};

export default PrincipalAttendance;
