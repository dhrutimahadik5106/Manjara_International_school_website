
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { supabase } from '../../../services/supabase';
import { CalendarDays, Save, RefreshCw, Trash2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const blank = () => ({ subject_id: '', teacher_id: '', room_number: '' });
const keyFor = (day, period) => `${day}|${period.start_time}`;
const clock = (value) => String(value || '').slice(0, 5);

export default function AdminTimetable() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [classId, setClassId] = useState('');
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [c, s, t, a, p, e] = await Promise.all([
        supabase.from('classes').select('id,grade_level,division,academic_year').order('grade_level'),
        supabase.from('subjects').select('id,name,code').order('name'),
        supabase.from('teachers').select('id,user_id,employee_id,profiles!teachers_user_id_fkey(full_name)'),
        supabase.from('teacher_class_assignments').select('id,teacher_id,class_id,subject_id'),
        supabase.from('timetable_periods').select('id,period_number,start_time,end_time,is_break,label').order('period_number'),
        supabase.from('timetable').select('id,class_id,day_of_week,start_time,end_time,subject_id,teacher_id,room_number').limit(5000)
      ]);

      for (const result of [c, s, t, a, p, e]) {
        if (result.error) throw result.error;
      }

      setClasses(c.data || []);
      setSubjects(s.data || []);
      setTeachers(t.data || []);
      setAssignments(a.data || []);
      setPeriods(p.data || []);
      setEntries(e.data || []);

      setClassId(prev =>
        (c.data || []).some(row => row.id === prev)
          ? prev
          : (c.data?.[0]?.id || '')
      );
    } catch (err) {
      setError(err.message || 'Unable to load timetable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setDrafts({});
    setMessage('');
  }, [classId]);

  const existing = useMemo(() => {
    const map = new Map();

    entries
      .filter(e => e.class_id === classId)
      .forEach(e => {
        map.set(`${e.day_of_week}|${clock(e.start_time)}`, e);
      });

    return map;
  }, [entries, classId]);

  const cell = (day, period) => {
    const key = keyFor(day, period);
    const current = existing.get(`${day}|${clock(period.start_time)}`);

    return drafts[key] || (
      current
        ? {
            subject_id: current.subject_id || '',
            teacher_id: current.teacher_id || '',
            room_number: current.room_number || ''
          }
        : blank()
    );
  };

  const update = (day, period, patch) => {
    const key = keyFor(day, period);
    const next = { ...cell(day, period), ...patch };

    setDrafts(prev => ({ ...prev, [key]: next }));
    setMessage('');
  };

  const allowedAssignments = useMemo(
    () => assignments.filter(a => a.class_id === classId),
    [assignments, classId]
  );

  const allowedSubjects = useMemo(() => {
    const ids = new Set(
      allowedAssignments.map(a => a.subject_id)
    );

    return subjects.filter(s => ids.has(s.id));
  }, [allowedAssignments, subjects]);

  const teacherOptions = (subjectId) => {
    const ids = new Set(
      allowedAssignments
        .filter(a => a.subject_id === subjectId)
        .map(a => a.teacher_id)
    );

    return teachers.filter(t => ids.has(t.id));
  };

  const saveCell = async (day, period) => {
    const key = keyFor(day, period);
    const value = cell(day, period);
    const current = existing.get(
      `${day}|${clock(period.start_time)}`
    );

    setError('');
    setMessage('');

    if (!classId || !value.subject_id || !value.teacher_id) {
      setError('Select a subject and assigned teacher before saving.');
      return;
    }

    if (!allowedAssignments.some(a =>
      a.subject_id === value.subject_id &&
      a.teacher_id === value.teacher_id
    )) {
      setError('This teacher is not assigned to that subject and class.');
      return;
    }

    const start = clock(period.start_time);
    const end = clock(period.end_time);

    const overlap = entries.find(e =>
      e.id !== current?.id &&
      e.day_of_week === day &&
      clock(e.start_time) < end &&
      clock(e.end_time) > start &&
      (
        e.class_id === classId ||
        (value.teacher_id && e.teacher_id === value.teacher_id) ||
        (
          value.room_number.trim() &&
          e.room_number?.trim().toLowerCase() ===
          value.room_number.trim().toLowerCase()
        )
      )
    );

    if (overlap) {
      setError(
        'Scheduling conflict: class, teacher or room is already booked at this time.'
      );
      return;
    }

    setSaving(key);

    try {
      const payload = {
        class_id: classId,
        day_of_week: day,
        start_time: period.start_time,
        end_time: period.end_time,
        subject_id: value.subject_id,
        teacher_id: value.teacher_id,
        room_number: value.room_number.trim() || null
      };

      const result = current
        ? await supabase
            .from('timetable')
            .update(payload)
            .eq('id', current.id)
            .select('id')
            .single()
        : await supabase
            .from('timetable')
            .insert(payload)
            .select('id')
            .single();

      if (result.error) throw result.error;

      setMessage(`${day} ${period.label} saved.`);
      await load();

      setDrafts(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } catch (err) {
      setError(err.message || 'Unable to save timetable.');
    } finally {
      setSaving('');
    }
  };

  const deleteCell = async (day, period) => {
    const key = keyFor(day, period);
    const current = existing.get(
      `${day}|${clock(period.start_time)}`
    );

    if (!current) {
      setDrafts(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }

    if (!window.confirm(`Clear ${day} ${period.label}?`)) {
      return;
    }

    setSaving(key);
    setError('');
    setMessage('');

    try {
      const result = await supabase
        .from('timetable')
        .delete()
        .eq('id', current.id)
        .select('id');

      if (result.error) throw result.error;

      if (!result.data?.length) {
        throw new Error(
          'The timetable entry was not deleted. Check permissions.'
        );
      }

      setMessage(`${day} ${period.label} cleared.`);
      await load();

      setDrafts(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } catch (err) {
      setError(err.message || 'Unable to delete timetable entry.');
    } finally {
      setSaving('');
    }
  };

  return (
    <PortalLayout title="Timetable Management">
      <div className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-mis-navy flex items-center gap-2">
                <CalendarDays size={25} />
                Timetable Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                9 lectures of 30 minutes, one break,
                Monday to Saturday.
              </p>
            </div>

            <button
              onClick={load}
              disabled={loading || !!saving}
              className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 font-semibold"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <label className="block mt-5 max-w-sm text-sm font-semibold text-slate-700">
            Select Class

            <select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="block mt-2 w-full border border-slate-200 rounded-xl p-3 bg-white"
            >
              {classes.length === 0 && (
                <option value="">No classes available</option>
              )}

              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.grade_level} - {c.division} ({c.academic_year})
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-slate-500 mt-3">
            Only teachers already assigned to the selected
            class and subject can be scheduled.
            Add missing assignments in school management first.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl"
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="p-6 bg-white rounded-2xl">
            Loading timetable...
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
            <table className="min-w-[1300px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-mis-navy">
                  <th className="p-3 border border-slate-200 text-left w-32">
                    Period / Time
                  </th>

                  {DAYS.map(day => (
                    <th
                      key={day}
                      className="p-3 border border-slate-200 text-left min-w-[190px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {periods.map(period => (
                  <tr
                    key={period.id}
                    className={period.is_break ? 'bg-amber-50' : ''}
                  >
                    <th className="p-3 border border-slate-200 text-left align-top whitespace-nowrap">
                      {period.label}

                      <div className="text-xs text-slate-500 font-normal mt-1">
                        {clock(period.start_time)}–
                        {clock(period.end_time)}
                      </div>
                    </th>

                    {DAYS.map(day => {
                      if (period.is_break) {
                        return (
                          <td
                            key={day}
                            className="p-3 border border-slate-200 text-center text-amber-800 font-bold"
                          >
                            BREAK
                          </td>
                        );
                      }

                      const value = cell(day, period);
                      const key = keyFor(day, period);
                      const saved = existing.has(
                        `${day}|${clock(period.start_time)}`
                      );
                      const options = teacherOptions(value.subject_id);

                      return (
                        <td
                          key={day}
                          className="p-2 border border-slate-200 align-top"
                        >
                          <div className="space-y-2">
                            <select
                              aria-label={`${day} ${period.label} subject`}
                              value={value.subject_id}
                              onChange={e =>
                                update(day, period, {
                                  subject_id: e.target.value,
                                  teacher_id: ''
                                })
                              }
                              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
                            >
                              <option value="">Select subject</option>

                              {allowedSubjects.map(subject => (
                                <option
                                  key={subject.id}
                                  value={subject.id}
                                >
                                  {subject.name}
                                </option>
                              ))}
                            </select>

                            <select
                              aria-label={`${day} ${period.label} teacher`}
                              value={value.teacher_id}
                              onChange={e =>
                                update(day, period, {
                                  teacher_id: e.target.value
                                })
                              }
                              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
                            >
                              <option value="">Select teacher</option>

                              {options.map(teacher => (
                                <option
                                  key={teacher.id}
                                  value={teacher.id}
                                >
                                  {teacher.profiles?.full_name ||
                                    teacher.employee_id ||
                                    'Teacher'}
                                </option>
                              ))}
                            </select>

                            <input
                              aria-label={`${day} ${period.label} room`}
                              placeholder="Room (optional)"
                              value={value.room_number}
                              onChange={e =>
                                update(day, period, {
                                  room_number: e.target.value
                                })
                              }
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                            />

                            <div className="flex gap-2">
                              <button
                                disabled={!!saving || !classId}
                                onClick={() => saveCell(day, period)}
                                className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-mis-navy text-white px-2 py-2 text-xs disabled:opacity-50"
                              >
                                <Save size={13} />
                                {saving === key
                                  ? 'Saving'
                                  : saved
                                    ? 'Update'
                                    : 'Save'}
                              </button>

                              <button
                                disabled={!!saving}
                                onClick={() => deleteCell(day, period)}
                                title="Clear period"
                                aria-label={`Clear ${day} ${period.label}`}
                                className="rounded-lg bg-red-50 text-red-700 px-2 py-2 disabled:opacity-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {!periods.length && (
              <p className="p-4 text-slate-500">
                No timetable periods configured.
              </p>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
