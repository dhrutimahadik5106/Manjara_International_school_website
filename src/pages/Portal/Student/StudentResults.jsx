
import React, { useEffect, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { supabase } from '../../../services/supabase';
import {
  Award,
  FileText,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

const BUCKET = 'student-results';

export default function StudentResults() {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState(null);
  const [error, setError] = useState('');

  const loadResults = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const userId = authData.user?.id;

      if (!userId) {
        throw new Error('Please log in again.');
      }

      // Find the logged-in student's record.
      const { data: studentRow, error: studentError } =
        await supabase
          .from('students')
          .select(
            'id,student_id,class_id,roll_number,classes(grade_level,division,academic_year)'
          )
          .eq('user_id', userId)
          .single();

      if (studentError) throw studentError;

      // Fetch ONLY this student's uploaded report cards.
      const { data: resultRows, error: resultError } =
        await supabase
          .from('student_result_files')
          .select(
            'id,student_id,exam_name,academic_year,file_path,file_name,file_type,created_at'
          )
          .eq('student_id', studentRow.id)
          .order('created_at', { ascending: false });

      if (resultError) throw resultError;

      setStudent(studentRow);
      setResults(resultRows || []);
    } catch (err) {
      setError(err.message || 'Unable to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const getSignedUrl = async (result) => {
    const { data, error: urlError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(result.file_path, 60);

    if (urlError) throw urlError;

    return data.signedUrl;
  };

  const viewResult = async (result) => {
    setOpeningId(result.id);
    setError('');

    // Open the tab immediately to avoid popup blockers.
    const newTab = window.open('', '_blank');

    try {
      const url = await getSignedUrl(result);

      if (newTab) {
        newTab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err) {
      if (newTab) newTab.close();
      setError(err.message || 'Unable to open result.');
    } finally {
      setOpeningId(null);
    }
  };

  const downloadResult = async (result) => {
    setOpeningId(result.id);
    setError('');

    try {
      const { data, error: downloadError } =
        await supabase.storage
          .from(BUCKET)
          .download(result.file_path);

      if (downloadError) throw downloadError;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');

      link.href = url;
      link.download = result.file_name || 'result.pdf';

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Unable to download result.');
    } finally {
      setOpeningId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return '';

    return new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <PortalLayout title="Examination Results">
      <div className="space-y-6">

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-mis-navy flex items-center gap-2">
                <Award size={26} />
                My Examination Results
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                View and download your published examination report cards.
              </p>

              {student && (
                <p className="text-sm font-semibold text-mis-blue mt-3">
                  {student.classes?.grade_level}
                  {' – '}
                  {student.classes?.division}
                  {' | '}
                  Roll No. {student.roll_number}
                </p>
              )}
            </div>

            <button
              onClick={loadResults}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-500">
            Loading examination results...
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <FileText
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <h2 className="text-lg font-bold text-mis-navy">
              No Results Published Yet
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Your uploaded examination report cards will appear here
              when published by your teacher.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map(result => (
              <div
                key={result.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-mis-blue">
                    <FileText size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-mis-navy">
                      {result.exam_name}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Academic Year: {result.academic_year}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Published: {formatDate(result.created_at)}
                    </p>

                    <p className="text-xs text-slate-500 mt-2 break-all">
                      {result.file_name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => viewResult(result)}
                    disabled={openingId === result.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-mis-navy text-white px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    <Eye size={17} />
                    View Result
                  </button>

                  <button
                    onClick={() => downloadResult(result)}
                    disabled={openingId === result.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-mis-navy px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    <Download size={17} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
