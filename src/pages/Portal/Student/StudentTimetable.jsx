
import React from 'react';
import useStudentRecords from '../../../hooks/useStudentRecords';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import PortalLayout from '../../../components/portal/PortalLayout';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen
} from 'lucide-react';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Must match the timetable periods configured by Admin.
const PERIODS = [
  { label: 'Period 1', start: '08:00', end: '08:30' },
  { label: 'Period 2', start: '08:30', end: '09:00' },
  { label: 'Period 3', start: '09:00', end: '09:30' },
  { label: 'Period 4', start: '09:30', end: '10:00' },
  { label: 'Break', start: '10:00', end: '10:30', isBreak: true },
  { label: 'Period 5', start: '10:30', end: '11:00' },
  { label: 'Period 6', start: '11:00', end: '11:30' },
  { label: 'Period 7', start: '11:30', end: '12:00' },
  { label: 'Period 8', start: '12:00', end: '12:30' },
  { label: 'Period 9', start: '12:30', end: '13:00' }
];

const formatTime = (value) => String(value || '').slice(0, 5);

const StudentTimetable = () => {
  const query = useStudentRecords('getStudentTimetable');

  const { student } = query;

  const timetable = Array.isArray(query.data) ? query.data : [];

  const grade = student?.grade || 'Class';
  const division = student?.division || '';

  const getSession = (day, period) => {
    return timetable.find(
      session =>
        session.day_of_week === day &&
        formatTime(session.start_time) === period.start
    );
  };

  if (query.loading || query.error) {
    return (
      <PortalLayout title="Class Timetable">
        <QueryState query={query} />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Class Timetable">
      <div className="space-y-6">

        {/* Page heading */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-mis-navy flex items-center gap-2">
                <CalendarDays size={25} />
                My Class Timetable
              </h1>

              <p className="text-slate-600 mt-2 font-semibold">
                {grade} {division}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Weekly Academic Schedule • Monday to Saturday
              </p>
            </div>

            <div className="bg-mis-soft text-mis-blue px-4 py-2 rounded-xl text-sm font-bold">
              View Only
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <CalendarDays size={17} />
              School Days
            </div>
            <p className="text-2xl font-bold text-mis-navy mt-2">
              6 Days
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <BookOpen size={17} />
              Daily Periods
            </div>
            <p className="text-2xl font-bold text-mis-navy mt-2">
              9 Lectures
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock size={17} />
              Scheduled Lectures
            </div>
            <p className="text-2xl font-bold text-mis-navy mt-2">
              {timetable.length}
            </p>
          </div>
        </div>

        {timetable.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <EmptyState>
              No lectures have been scheduled for your class yet.
            </EmptyState>
          </div>
        )}

        {/* Weekly timetable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {DAYS.map(day => {
            const scheduledCount = timetable.filter(
              session => session.day_of_week === day
            ).length;

            return (
              <div
                key={day}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-lg font-extrabold text-mis-navy">
                    {day}
                  </h2>

                  <span className="text-xs font-semibold text-slate-500">
                    {scheduledCount} / 9 Scheduled
                  </span>
                </div>

                <div className="space-y-3">
                  {PERIODS.map(period => {
                    if (period.isBreak) {
                      return (
                        <div
                          key={period.label}
                          className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-center"
                        >
                          <p className="font-bold text-amber-800 text-sm">
                            BREAK
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            {period.start} – {period.end}
                          </p>
                        </div>
                      );
                    }

                    const session = getSession(day, period);

                    return (
                      <div
                        key={period.label}
                        className={`rounded-xl border p-4 ${
                          session
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-white border-dashed border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-mis-blue">
                              {period.label}
                            </p>

                            <h3 className={`font-bold mt-1 ${
                              session
                                ? 'text-mis-navy'
                                : 'text-slate-400'
                            }`}>
                              {session?.subjects?.name || 'Not scheduled'}
                            </h3>
                          </div>

                          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                            {period.start} – {period.end}
                          </span>
                        </div>

                        {session && (
                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <User size={13} />
                              {session.teachers?.profiles?.full_name ||
                                'Teacher not available'}
                            </span>

                            <span className="flex items-center gap-1">
                              <MapPin size={13} />
                              {session.room_number || 'Room not assigned'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-slate-500">
          This timetable is maintained by the school administrator.
          Any changes made by Admin will appear here when the timetable
          data is refreshed.
        </p>
      </div>
    </PortalLayout>
  );
};

export default StudentTimetable;
