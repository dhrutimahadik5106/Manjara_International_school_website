import useStudentRecords from '../../../hooks/useStudentRecords';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import { BookOpen, Upload, CheckCircle2, Clock, FileText, X } from 'lucide-react';

const StudentAssignments = () => {
  const { user } = useAuth();
  const query = useStudentRecords('getStudentAssignments');
  const { data: assignments, student } = query;
  const [submitError, setSubmitError] = useState('');
  const [selectedAsg, setSelectedAsg] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsg || !file) return;

    setIsSubmitting(true); setSubmitError('');
    try {
      await portalService.submitAssignment(selectedAsg.id, file);
      setSuccessMsg('Assignment submitted successfully.');
      setSelectedAsg(null); setFile(null); query.reload();
    } catch (error) { setSubmitError(error.message); }
    finally { setIsSubmitting(false); }
  };
  if (query.loading || query.error) return <PortalLayout title="Assignments"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Assignments & Homework">
      <div className="space-y-6">
        {!assignments.length && <EmptyState>No assignments yet.</EmptyState>}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Assignments Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {assignments.map((asg) => (
            <div key={asg.id} className="card-surface p-6 bg-white border border-slate-200/90 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-mis-soft text-mis-blue text-xs font-bold uppercase">
                    {asg.subject}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    asg.status === 'submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asg.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-mis-navy">{asg.title}</h3>
                <p className="text-xs sm:text-sm text-mis-muted mt-2 leading-relaxed">{asg.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div>Assigned by: <strong className="text-slate-700">{asg.teacherName}</strong></div>
                  <div>Due Date: <strong className="text-mis-navy">{asg.dueDate}</strong></div>
                  {asg.attachment_url && <FileLink value={asg.attachment_url}>Assignment attachment</FileLink>}
                  {asg.submissionFile && (
                    <div className="text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                      <FileText size={14} /> Submitted: <FileLink value={asg.submissionFile}>View submitted file</FileLink> ({asg.submissionDate})
                    </div>
                  )}
                </div>
              </div>

              {!['submitted', 'graded'].includes(asg.status) ? (
                <button
                  onClick={() => setSelectedAsg(asg)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  <Upload size={15} />
                  Submit Solution
                </button>
              ) : (
                <div className="text-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                  ✓ Solution Received
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Modal */}
      {selectedAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button onClick={() => setSelectedAsg(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-mis-navy mb-1">Submit Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedAsg.title} ({selectedAsg.subject})</p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50">
                <Upload size={32} className="mx-auto text-mis-blue mb-2" />
                <label className="block text-xs font-bold text-slate-700 cursor-pointer mb-1">
                  Choose Assignment File (PDF, DOCX)
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="asgFile"
                />
                <label htmlFor="asgFile" className="inline-block px-3 py-1.5 bg-mis-soft text-mis-blue text-xs font-bold rounded-xl border border-mis-blue/20 cursor-pointer">
                  Browse File
                </label>
                {file && <p className="text-xs font-bold text-emerald-600 mt-2">Selected: {file.name}</p>}
              </div>

              <button
                type="submit"
                disabled={!file || isSubmitting}
                className="w-full py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition shadow"
              >
                {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default StudentAssignments;
