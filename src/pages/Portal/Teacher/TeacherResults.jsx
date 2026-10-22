
import React, { useEffect, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { supabase } from '../../../services/supabase';
import {
  Upload,
  FileText,
  Trash2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const BUCKET = 'student-results';
const MAX_SIZE = 10 * 1024 * 1024;

export default function TeacherResults() {
  const [teacherId, setTeacherId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [classId, setClassId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [examName, setExamName] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('Please log in again.');

      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (teacherError) throw teacherError;

      const { data: assigned, error: assignedError } = await supabase
        .from('teacher_class_assignments')
        .select(
          'class_id, classes(id,grade_level,division,academic_year)'
        )
        .eq('teacher_id', teacher.id);

      if (assignedError) throw assignedError;

      const uniqueClasses = Array.from(
        new Map(
          (assigned || []).map(a => [
            a.class_id,
            {
              id: a.class_id,
              ...a.classes
            }
          ])
        ).values()
      );

      const { data: studentRows, error: studentError } = await supabase
        .from('students')
        .select(
          'id,class_id,roll_number,student_id,profiles!students_user_id_fkey(full_name)'
        );

      if (studentError) throw studentError;

      const { data: resultRows, error: resultError } = await supabase
        .from('student_result_files')
        .select(
          'id,student_id,class_id,teacher_id,exam_name,academic_year,file_path,file_name,file_type,created_at'
        )
        .eq('teacher_id', teacher.id)
        .order('created_at', { ascending: false });

      if (resultError) throw resultError;

      setTeacherId(teacher.id);
      setAssignments(uniqueClasses);
      setStudents(studentRows || []);
      setResults(resultRows || []);

      setClassId(prev =>
        uniqueClasses.some(c => c.id === prev)
          ? prev
          : uniqueClasses[0]?.id || ''
      );
    } catch (err) {
      setError(err.message || 'Unable to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const classStudents = students
    .filter(s => s.class_id === classId)
    .sort((a, b) => (a.roll_number || 0) - (b.roll_number || 0));

  const selectedStudent = classStudents.find(s => s.id === studentId);

  const getStudentName = (id) => {
    const s = students.find(row => row.id === id);
    return s?.profiles?.full_name || s?.student_id || 'Student';
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return 'Please select a file.';

    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    if (!allowed.includes(selectedFile.type)) {
      return 'Only PDF, JPG and PNG files are allowed.';
    }

    if (selectedFile.size > MAX_SIZE) {
      return 'File must be smaller than 10 MB.';
    }

    return '';
  };

  const uploadResult = async (e) => {
    e.preventDefault();
    if (saving) return;

    setError('');
    setMessage('');

    if (!classId || !studentId || !examName.trim()) {
      setError('Select a class, student and examination.');
      return;
    }

    if (!selectedStudent) {
      setError('Student does not belong to the selected class.');
      return;
    }

    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    setSaving(true);

    let recordId = null;

    try {
      const extension =
        file.type === 'application/pdf'
          ? 'pdf'
          : file.type === 'image/png'
            ? 'png'
            : 'jpg';

      const uniqueId = crypto.randomUUID();
      const filePath = `${studentId}/${uniqueId}/result.${extension}`;

      const { data: record, error: insertError } = await supabase
        .from('student_result_files')
        .insert({
          student_id: studentId,
          class_id: classId,
          teacher_id: teacherId,
          exam_name: examName.trim(),
          academic_year: academicYear.trim(),
          file_path: filePath,
          file_name: file.name,
          file_type: file.type
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      recordId = record.id;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      setMessage('Student result uploaded successfully.');
      setExamName('');
      setFile(null);
      document.getElementById('result-file-input').value = '';

      await load();
    } catch (err) {
      if (recordId) {
        await supabase
          .from('student_result_files')
          .delete()
          .eq('id', recordId);
      }

      setError(err.message || 'Unable to upload result.');
    } finally {
      setSaving(false);
    }
  };

  const viewResult = async (result) => {
    setError('');

    const { data, error: urlError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(result.file_path, 60);

    if (urlError) {
      setError(urlError.message);
      return;
    }

    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const deleteResult = async (result) => {
    if (!window.confirm(`Delete ${result.exam_name} result?`)) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([result.file_path]);

      if (storageError) throw storageError;

      const { data, error: deleteError } = await supabase
        .from('student_result_files')
        .delete()
        .eq('id', result.id)
        .select('id');

      if (deleteError) throw deleteError;
      if (!data?.length) throw new Error('Result record was not deleted.');

      setMessage('Result deleted successfully.');
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete result.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout title="Student Results">
      <div className="space-y-6">

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-2xl font-extrabold text-mis-navy">
            Student Result Uploads
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Upload individual PDF or image report cards for students
            in your assigned classes.
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl">
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-6 rounded-xl">
            Loading...
          </div>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-mis-navy mb-5">
                Upload New Result
              </h2>

              <form onSubmit={uploadResult} className="space-y-4">

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Class & Division
                  </label>
                  <select
                    value={classId}
                    onChange={e => {
                      setClassId(e.target.value);
                      setStudentId('');
                    }}
                    className="w-full p-3 border rounded-xl bg-white"
                    required
                  >
                    {assignments.length === 0 && (
                      <option value="">No assigned classes</option>
                    )}
                    {assignments.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.grade_level} – {c.division}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Student
                  </label>
                  <select
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white"
                    required
                  >
                    <option value="">Select student</option>
                    {classStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        Roll {s.roll_number} – {s.profiles?.full_name || s.student_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Examination Name
                  </label>
                  <input
                    value={examName}
                    onChange={e => setExamName(e.target.value)}
                    placeholder="e.g. Unit Test 1"
                    className="w-full p-3 border rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Academic Year
                  </label>
                  <input
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Result File (PDF, JPG or PNG)
                  </label>
                  <input
                    id="result-file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full p-3 border rounded-xl"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Maximum file size: 10 MB
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving || !assignments.length}
                  className="w-full bg-mis-navy text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  {saving ? 'Uploading...' : 'Publish Student Result'}
                </button>
              </form>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-mis-navy">
                  Uploaded Results
                </h2>
                <button
                  onClick={load}
                  className="p-2 bg-slate-100 rounded-lg"
                  title="Refresh"
                >
                  <RefreshCw size={17} />
                </button>
              </div>

              {results.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No result files uploaded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {results.map(result => (
                    <div
                      key={result.id}
                      className="flex flex-wrap justify-between items-center gap-4 border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={22} className="text-mis-blue" />
                        <div>
                          <p className="font-bold text-mis-navy">
                            {result.exam_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getStudentName(result.student_id)}
                            {' • '}
                            {result.academic_year}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => viewResult(result)}
                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1 text-sm"
                        >
                          <ExternalLink size={15} />
                          View
                        </button>

                        <button
                          onClick={() => deleteResult(result)}
                          disabled={saving}
                          className="px-3 py-2 bg-red-50 text-red-700 rounded-lg flex items-center gap-1 text-sm disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
