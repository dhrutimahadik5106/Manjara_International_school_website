
import { useEffect, useState } from 'react';

// Only these classes should appear in the dropdown.
const ALLOWED_GRADES = [
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

const ALLOWED_DIVISIONS = ['A', 'B', 'C'];

export const classLabel = (value) => {
  const match = String(value).match(
    /^(?:Grade\s*)?(\d+)(?:st|nd|rd|th)?(?:\s*Standard)?$/i
  );

  if (!match) return value;

  const n = Number(match[1]);

  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? 'th'
      : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');

  return `${n}${suffix} Standard`;
};

export default function ClassAssignmentFields({
  classes = [],
  value,
  onChange,
  disabled = false,
}) {
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');

  // Hide 9th, 10th and any other unsupported grades.
  const filteredClasses = classes.filter(
    (cls) =>
      ALLOWED_GRADES.includes(cls.grade_level) &&
      ALLOWED_DIVISIONS.includes(cls.division)
  );

  const selected = filteredClasses.find(
    (cls) => cls.id === value
  );

  const years = [
    ...new Set(
      filteredClasses
        .map((cls) => cls.academic_year)
        .filter(Boolean)
    ),
  ].sort().reverse();

  useEffect(() => {
    if (selected) {
      setYear(selected.academic_year);
      setGrade(selected.grade_level);
    }
  }, [selected?.id]);

  const chosenYear = year || years[0] || '';

  const grades = ALLOWED_GRADES.filter((allowedGrade) =>
    filteredClasses.some(
      (cls) =>
        cls.academic_year === chosenYear &&
        cls.grade_level === allowedGrade
    )
  );

  const divisions = filteredClasses
    .filter(
      (cls) =>
        cls.academic_year === chosenYear &&
        cls.grade_level === grade
    )
    .sort(
      (a, b) =>
        ALLOWED_DIVISIONS.indexOf(a.division) -
        ALLOWED_DIVISIONS.indexOf(b.division)
    );

  const style =
    'w-full px-3 py-2 rounded-xl border border-slate-200 ' +
    'font-bold outline-none focus:border-mis-blue bg-white';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

      {/* Academic Year */}
      <label className="block font-bold text-slate-700">
        Academic Year

        <select
          aria-label="Academic Year"
          required
          disabled={disabled || !years.length}
          value={chosenYear}
          className={style}
          onChange={(e) => {
            setYear(e.target.value);
            setGrade('');
            onChange('');
          }}
        >
          {!years.length && (
            <option value="">No classes configured</option>
          )}

          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {/* Class */}
      <label className="block font-bold text-slate-700">
        Class

        <select
          aria-label="Class"
          required
          disabled={disabled || !chosenYear}
          value={grade}
          className={style}
          onChange={(e) => {
            setGrade(e.target.value);
            onChange('');
          }}
        >
          <option value="">Select class</option>

          {grades.map((item) => (
            <option key={item} value={item}>
              {classLabel(item)}
            </option>
          ))}
        </select>
      </label>

      {/* Division */}
      <label className="block font-bold text-slate-700">
        Division

        <select
          aria-label="Division"
          required
          disabled={disabled || !grade}
          value={value || ''}
          className={style}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select division</option>

          {divisions.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.division}
            </option>
          ))}
        </select>
      </label>

    </div>
  );
}
