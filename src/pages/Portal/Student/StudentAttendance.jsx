
import React, { useEffect, useMemo, useState } from 'react';
import useStudentRecords from '../../../hooks/useStudentRecords';
import PortalLayout from '../../../components/portal/PortalLayout';
import { QueryState } from '../../../components/portal/PortalStates';
import { portalService, localDate } from '../../../services/portalService';
import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const pad = (n) => String(n).padStart(2, '0');

const getMonth = (date) => date.slice(0, 7);

const shiftMonth = (month, amount) => {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(year, m - 1 + amount, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

const StudentAttendance = () => {
  const query = useStudentRecords('getStudentAttendance');
  const { student } = query;
  const attendance = Array.isArray(query.data) ? query.data : [];

  const [month, setMonth] = useState(getMonth(localDate()));
  const [holidays, setHolidays] = useState([]);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const [holidayError, setHolidayError] = useState('');

  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setHolidayLoading(true);
      setHolidayError('');
      setHolidays([]);

      try {
        const rows = await portalService.getHolidays(null, year);
        if (!cancelled) setHolidays(rows || []);
      } catch (error) {
        if (!cancelled) {
          setHolidayError(
            error?.message || 'Unable to load holidays.'
          );
        }
      } finally {
        if (!cancelled) setHolidayLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [year]);

  const calendar = useMemo(() => {
    const first = new Date(Date.UTC(year, monthNumber - 1, 1));
    const count = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const offset = (first.getUTCDay() + 6) % 7;

    const records = new Map(
      attendance.map((row) => [row.date, row])
    );

    const cells = Array(offset).fill(null);
    const today = localDate();

    for (let day = 1; day <= count; day++) {
      const date = `${month}-${pad(day)}`;
      const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
      const weekend = weekday === 0 || weekday === 6;

      const holiday = holidays.find((h) =>
        h.is_active !== false &&
        (!h.applicable_to ||
          h.applicable_to.includes('student')) &&
        date >= h.start_date &&
        date <= (h.end_date || h.start_date)
      );

      const record = records.get(date);

      let status = 'not-marked';
      if (weekend) status = 'weekend';
      else if (holiday) status = 'holiday';
      else if (date > today) status = 'upcoming';
      else if (record) status = record.status;

      cells.push({
        day, date, status,
        holidayName: holiday?.title,
        remarks: record?.remarks,
      });
    }

    return cells;
  }, [attendance, holidays, month, year, monthNumber]);

  const days = calendar.filter(Boolean);

  const workingDays = days.filter((d) =>
    !['weekend', 'holiday', 'upcoming'].includes(d.status)
  );

  const present = workingDays.filter(d => d.status === 'present').length;
  const late = workingDays.filter(d => d.status === 'late').length;
  const absent = workingDays.filter(d => d.status === 'absent').length;
  const excused = workingDays.filter(d => d.status === 'excused').length;
  const marked = present + late + absent + excused;
  const notMarked = workingDays.filter(d => d.status === 'not-marked').length;

  // Percentage is based on recorded days, not unmarked days.
  const percentage = marked
    ? Math.round(((present + late) / marked) * 100)
    : null;

  const colors = {
    present: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    absent: 'bg-rose-100 text-rose-800 border-rose-200',
    late: 'bg-amber-100 text-amber-800 border-amber-200',
    excused: 'bg-sky-100 text-sky-800 border-sky-200',
    holiday: 'bg-purple-100 text-purple-800 border-purple-200',
    weekend: 'bg-slate-100 text-slate-400 border-slate-200',
    'not-marked': 'bg-white text-slate-600 border-slate-200',
    upcoming: 'bg-slate-50 text-slate-400 border-slate-100',
  };

  const labels = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    holiday: 'Holiday',
    weekend: 'Weekend',
    'not-marked': 'Not marked',
    upcoming: 'Upcoming',
  };

  if (query.loading || query.error) {
    return (
      <PortalLayout title="Attendance">
        <QueryState query={query} />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Attendance History">
      <div className="space-y-6">

        <div className="card-surface p-5 bg-white border border-slate-200 rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-mis-navy">
                My Attendance Calendar
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {student?.fullName || 'Student'} · {student?.grade || 'Class not assigned'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMonth(shiftMonth(month, -1))}
                className="p-2 rounded-lg border border-slate-200"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <input
                type="month"
                value={month}
                onChange={(e) => e.target.value && setMonth(e.target.value)}
                className="border border-slate-200 rounded-lg p-2 font-bold"
              />

              <button
                type="button"
                onClick={() => setMonth(shiftMonth(month, 1))}
                className="p-2 rounded-lg border border-slate-200"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {holidayError && (
          <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-xl">
            {holidayError}
          </div>
        )}

        {holidayLoading && (
          <p className="text-sm text-slate-500">
            Checking school holidays...
          </p>
        )}

        {!holidayLoading && !holidayError && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ['Recorded Days', marked],
                ['Present', present],
                ['Late', late],
                ['Absent', absent],
                ['Attendance', percentage === null ? '—' : `${percentage}%`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="card-surface bg-white border border-slate-200 rounded-xl p-4 text-center"
                >
                  <p className="text-xs font-bold text-slate-500">{label}</p>
                  <p className="text-2xl font-extrabold text-mis-navy mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="card-surface bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
              <h3 className="font-extrabold text-mis-navy flex items-center gap-2 mb-5">
                <CalendarCheck size={19} />
                Monthly Attendance
              </h3>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-slate-500 py-2">
                    {d}
                  </div>
                ))}

                {calendar.map((cell, index) =>
                  cell ? (
                    <div
                      key={cell.date}
                      title={`${cell.date}: ${cell.holidayName || labels[cell.status]}${cell.remarks ? ` - ${cell.remarks}` : ''}`}
                      className={`min-h-16 sm:min-h-20 rounded-xl border p-1 sm:p-2 text-center ${colors[cell.status]}`}
                    >
                      <div className="text-sm font-extrabold">{cell.day}</div>
                      <div className="text-[9px] sm:text-[11px] font-bold mt-2 break-words">
                        {cell.holidayName || labels[cell.status]}
                      </div>
                    </div>
                  ) : (
                    <div key={`blank-${index}`} />
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-5 text-xs">
                {['present', 'absent', 'late', 'excused', 'holiday', 'weekend', 'not-marked'].map((status) => (
                  <span key={status} className={`px-2 py-1 rounded-md border ${colors[status]}`}>
                    {labels[status]}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
              <p><strong>Working days elapsed:</strong> {workingDays.length}</p>
              <p><strong>Not marked:</strong> {notMarked}</p>
              <p><strong>Excused:</strong> {excused}</p>
              <p className="mt-2">
                Attendance percentage = (Present + Late) ÷ Recorded Days × 100.
                Unmarked days are not counted as absences.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                The calendar uses saved attendance records and active holidays.
                Future holiday calendars must be configured by the school.
              </p>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentAttendance;
