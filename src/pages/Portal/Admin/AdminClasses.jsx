
import React, { useMemo, useState } from 'react';
import {
  Layers,
  Search,
  RefreshCw,
  Users,
  GraduationCap,
  BookOpen,
  Plus,
  Info,
} from 'lucide-react';

import usePortalQuery from '../../../hooks/usePortalQuery';
import {
  QueryState,
  EmptyState,
} from '../../../components/portal/PortalStates';
import { portalService } from '../../../services/portalService';
import PortalLayout from '../../../components/portal/PortalLayout';

const GRADES = [
  'Nursery',
  'LKG',
  'UKG',
  '1st Standard',
  '2nd Standard',
  '3rd Standard',
  '4th Standard',
  '5th Standard',
  '6th Standard',
  '7th Standard',
  '8th Standard',
];

const DIVISIONS = ['A', 'B', 'C'];

const AdminClasses = () => {
  const query = usePortalQuery(
    () => portalService.getClasses(),
    []
  );

  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [message, setMessage] = useState('');

  
const classesList = useMemo(() => {
  return (query.data || [])
    .filter((cls) =>
      GRADES.includes(cls.grade_level) &&
      DIVISIONS.includes(cls.division) &&
      cls.academic_year === '2026-2027'
    )
    .map((cls) => ({
      ...cls,
      grade: cls.grade_level,
      room: cls.room_number,
      count: Number(cls.students?.[0]?.count ?? 0),
    }))
    .sort((a, b) => {
      const gradeOrder =
        GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade);

      if (gradeOrder !== 0) return gradeOrder;

      return a.division.localeCompare(b.division);
    });
}, [query.data]);

  const filteredClasses = useMemo(() => {
    return classesList.filter((cls) => {
      const matchesSearch =
        `${cls.grade} ${cls.division} ${cls.academic_year}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesGrade =
        selectedGrade === 'all' ||
        cls.grade === selectedGrade;

      const matchesDivision =
        selectedDivision === 'all' ||
        cls.division === selectedDivision;

      return (
        matchesSearch &&
        matchesGrade &&
        matchesDivision
      );
    });
  }, [
    classesList,
    search,
    selectedGrade,
    selectedDivision,
  ]);

  const totalStudents = classesList.reduce(
    (sum, cls) => sum + cls.count,
    0
  );

  const configuredGrades = new Set(
    classesList.map((cls) => cls.grade)
  ).size;

  const availableAcademicYears = [
    ...new Set(
      classesList
        .map((cls) => cls.academic_year)
        .filter(Boolean)
    ),
  ];

  const currentAcademicYear =
    availableAcademicYears.includes('2026-2027')
      ? '2026-2027'
      : availableAcademicYears[0] || '2026-2027';

  const missingClasses = GRADES.flatMap((grade) =>
    DIVISIONS.filter(
      (division) =>
        !classesList.some(
          (cls) =>
            cls.grade === grade &&
            cls.division === division &&
            cls.academic_year === currentAcademicYear
        )
    ).map((division) => ({
      grade,
      division,
    }))
  );

  if (query.loading || query.error) {
    return (
      <PortalLayout title="Classes">
        <QueryState query={query} />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Classes, Divisions & Subjects Management">
      <div className="space-y-6">

        {/* Page header */}
        <div className="card-surface p-6 bg-white border border-slate-200/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-mis-navy flex items-center gap-2">
                <Layers size={22} className="text-mis-blue" />
                School Classes & Divisions
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Manage academic classes from Nursery to 8th Standard,
                including Divisions A, B and C.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessage('');
                query.refetch?.();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-sm font-bold rounded-xl transition"
            >
              <RefreshCw size={16} />
              Refresh Classes
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-surface bg-white p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <Layers className="text-blue-600" size={25} />
              <div>
                <p className="text-xs text-slate-500 font-bold">
                  Total Class Divisions
                </p>
                <h3 className="text-2xl font-extrabold text-mis-navy">
                  {classesList.length}
                </h3>
              </div>
            </div>
          </div>

          <div className="card-surface bg-white p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <GraduationCap
                className="text-emerald-600"
                size={25}
              />
              <div>
                <p className="text-xs text-slate-500 font-bold">
                  Configured Grades
                </p>
                <h3 className="text-2xl font-extrabold text-mis-navy">
                  {configuredGrades}
                </h3>
              </div>
            </div>
          </div>

          <div className="card-surface bg-white p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <Users className="text-amber-600" size={25} />
              <div>
                <p className="text-xs text-slate-500 font-bold">
                  Enrolled Students
                </p>
                <h3 className="text-2xl font-extrabold text-mis-navy">
                  {totalStudents}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-surface bg-white border border-slate-200 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search classes..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:border-mis-blue"
              />
            </div>

            <select
              value={selectedGrade}
              onChange={(event) =>
                setSelectedGrade(event.target.value)
              }
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="all">All Grades</option>

              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>

            <select
              value={selectedDivision}
              onChange={(event) =>
                setSelectedDivision(event.target.value)
              }
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="all">All Divisions</option>

              {DIVISIONS.map((division) => (
                <option key={division} value={division}>
                  Division {division}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Existing class cards */}
        {filteredClasses.length === 0 ? (
          <EmptyState>
            No matching classes found.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="card-surface bg-white border border-slate-200/90 p-5 space-y-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-mis-blue bg-mis-soft px-3 py-1 rounded-full">
                    {cls.academic_year}
                  </span>

                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                    Active Class
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-mis-navy">
                    {cls.grade}
                  </h3>

                  <p className="text-sm font-semibold text-mis-blue mt-1">
                    Division {cls.division}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={16} />
                    <span>{cls.count} Enrolled Students</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} />
                    <span>
                      Room: {cls.room || 'Not assigned'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Missing divisions */}
        {missingClasses.length > 0 && (
          <div className="card-surface bg-white border border-slate-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info
                size={20}
                className="text-amber-600 shrink-0 mt-1"
              />

              <div>
                <h3 className="text-lg font-bold text-mis-navy">
                  Missing Class Divisions
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  These divisions are not yet configured in
                  Supabase for academic year {currentAcademicYear}.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {missingClasses.map((cls) => (
                <span
                  key={`${cls.grade}-${cls.division}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {cls.grade} - {cls.division}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Add these records using the approved Supabase class
              setup SQL. They will appear automatically after
              refreshing this page.
            </p>
          </div>
        )}

        {message && (
          <p
            role="status"
            className="text-sm text-mis-muted"
          >
            {message}
          </p>
        )}

        {/* Future Class Teacher assignment */}
        <div className="card-surface bg-blue-50 border border-blue-100 p-5">
          <h3 className="font-bold text-mis-navy">
            Next: Class Teacher Assignment
          </h3>

          <p className="text-sm text-slate-600 mt-2">
            The next step is to connect a Class Teacher to each
            class and division. Once that backend is configured,
            assigned teachers will be able to mark daily
            attendance for their own classes.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminClasses;
