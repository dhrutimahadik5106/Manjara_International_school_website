
import React, { useMemo } from 'react';
import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import {
  QueryState,
  EmptyState
} from '../../../components/portal/PortalStates';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Clock, CalendarDays, BookOpen } from 'lucide-react';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const formatTime = (time) => String(time || '').slice(0, 5);

const TeacherTimetable = () => {
  const query = usePortalQuery(
    () => portalService.getTeacherTimetable(),
    []
  );

  const { teacher } = usePortalData();

  const timetable = Array.isArray(query.data)
    ? query.data
    : [];

  const sortedTimetable = useMemo(() => {
    return [...timetable].sort((a, b) => {
      const dayA = DAYS.indexOf(a.day_of_week);
      const dayB = DAYS.indexOf(b.day_of_week);

      if (dayA !== dayB) return dayA - dayB;

      return String(a.start_time || '').localeCompare(
        String(b.start_time || '')
      );
    });
  }, [timetable]);

  const totalClasses = new Set(
    timetable.map(slot => slot.class_id)
  ).size;

  const totalSubjects = new Set(
    timetable.map(slot => slot.subject_id)
  ).size;

  const teacherName =
    teacher?.profiles?.full_name ||
    teacher?.profile?.full_name ||
    teacher?.full_name ||
    'My Teaching Schedule';

  if (query.loading || query.error) {
    return (
      <PortalLayout title="Faculty Teaching Schedule">
        <QueryState query={query} />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Faculty Teaching Schedule">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-2xl font-extrabold text-mis-navy">
            My Teaching Timetable
          </h1>

          <p className="text-slate-500 mt-2">
            {teacherName}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Your weekly lectures assigned by the school administrator.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock size={17} />
              Weekly Lectures
            </div>

            <p className="text-3xl font-bold text-mis-navy mt-2">
              {timetable.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <CalendarDays size={17} />
              Assigned Classes
            </div>

            <p className="text-3xl font-bold text-mis-navy mt-2">
              {totalClasses}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <BookOpen size={17} />
              Subjects
            </div>

            <p className="text-3xl font-bold text-mis-navy mt-2">
              {totalSubjects}
            </p>
          </div>
        </div>

        {sortedTimetable.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <EmptyState>
              No lectures have been assigned to your timetable yet.
            </EmptyState>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-extrabold text-mis-navy mb-4">
              Weekly Teaching Schedule
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Day</th>
                    <th className="p-3">Timing</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Room</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sortedTimetable.map((slot, index) => (
                    <tr
                      key={slot.id || index}
                      className="hover:bg-slate-50"
                    >
                      <td className="p-3 font-bold text-mis-navy">
                        {slot.day_of_week}
                      </td>

                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {formatTime(slot.start_time)}
                        {' – '}
                        {formatTime(slot.end_time)}
                      </td>

                      <td className="p-3 font-semibold">
                        {slot.subjects?.name || 'Not available'}
                      </td>

                      <td className="p-3">
                        {slot.classes?.grade_level || 'Unknown class'}
                        {' '}
                        {slot.classes?.division || ''}
                      </td>

                      <td className="p-3 text-slate-500">
                        {slot.room_number || 'Not assigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              This timetable is read-only. Contact the school
              administrator if a lecture needs to be changed.
            </p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default TeacherTimetable;
