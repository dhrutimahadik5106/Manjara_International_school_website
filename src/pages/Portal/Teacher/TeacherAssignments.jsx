
import React, { useState } from 'react';
import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { supabase } from '../../../services/supabase';
import {
  BookOpen,
  Plus,
  X,
  Pencil,
  Trash2,
  CalendarDays,
  ExternalLink
} from 'lucide-react';

const emptyForm = () => ({
  assignmentId: '',
  title: '',
  description: '',
  dueDate: '',
  attachment_url: ''
});

const TeacherAssignments = () => {
  const { teacher } = usePortalData();
  const authorizedClasses = teacher?.assignedClasses || [];

  const query = usePortalQuery(
    () => portalService.getTeacherAssignments(),
    []
  );

  const assignments = Array.isArray(query.data) ? query.data : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [message, setMessage] = useState('');

  const selected =
    authorizedClasses.find(c => c.id === formData.assignmentId) ||
    authorizedClasses[0];

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setSaveError('');
    setIsModalOpen(true);
  };

  const openEdit = (assignment) => {
    const matchingClass = authorizedClasses.find(
      c =>
        c.class_id === assignment.class_id &&
        c.subject_id === assignment.subject_id
    );

    if (!matchingClass) {
      setMessage('');
      setSaveError(
        'You are no longer assigned to this class and subject.'
      );
      return;
    }

    setEditingId(assignment.id);
    setFormData({
      assignmentId: matchingClass.id,
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.due_date || '',
      attachment_url: assignment.attachment_url || ''
    });
    setSaveError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selected || saving) return;

    setSaving(true);
    setSaveError('');
    setMessage('');

    try {
      const payload = {
        class_id: selected.class_id,
        subject_id: selected.subject_id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        due_date: formData.dueDate,
        attachment_url: formData.attachment_url.trim() || null
      };

      if (editingId) {
        const { data, error } = await supabase
          .from('assignments')
          .update(payload)
          .eq('id', editingId)
          .select('id');

        if (error) throw error;
        if (!data?.length) {
          throw new Error(
            'Homework was not updated. Check teacher permissions.'
          );
        }
      } else {
        await portalService.createAssignment(payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm());
      setMessage(
        editingId
          ? 'Homework updated successfully.'
          : 'Homework published successfully.'
      );

      await query.reload();
    } catch (error) {
      setSaveError(error.message || 'Unable to save homework.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete homework "${assignment.title}"?`)) {
      return;
    }

    setDeletingId(assignment.id);
    setSaveError('');
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignment.id)
        .select('id');

      if (error) throw error;
      if (!data?.length) {
        throw new Error(
          'Homework was not deleted. Check teacher permissions.'
        );
      }

      setMessage('Homework deleted successfully.');
      await query.reload();
    } catch (error) {
      setSaveError(error.message || 'Unable to delete homework.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PortalLayout title="Homework Management">
      <div className="space-y-6">

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-mis-navy flex items-center gap-2">
              <BookOpen size={25} />
              Homework Management
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Publish homework for your assigned classes and subjects.
            </p>
          </div>

          <button
            onClick={openCreate}
            disabled={!authorizedClasses.length}
            className="inline-flex items-center gap-2 px-4 py-3 bg-mis-navy text-white text-sm font-bold rounded-xl disabled:opacity-50"
          >
            <Plus size={17} />
            Add Homework
          </button>
        </div>

        {message && (
          <div className="p-4 bg-green-50 text-green-800 rounded-xl border border-green-200">
            {message}
          </div>
        )}

        {saveError && !isModalOpen && (
          <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            {saveError}
          </div>
        )}

        {!authorizedClasses.length && (
          <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
            No classes or subjects are assigned to your teacher account.
          </div>
        )}

        {query.loading || query.error ? (
          <QueryState query={query} />
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <EmptyState>No homework published yet.</EmptyState>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map(asg => (
              <div
                key={asg.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <span className="px-3 py-1 rounded-full bg-mis-soft text-mis-blue text-xs font-bold">
                    {asg.subjects?.name || 'Subject'}
                    {' • '}
                    {asg.classes?.grade_level || 'Class'}
                    {' '}
                    {asg.classes?.division || ''}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(asg)}
                      title="Edit homework"
                      className="p-2 bg-blue-50 text-blue-700 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(asg)}
                      disabled={deletingId === asg.id}
                      title="Delete homework"
                      className="p-2 bg-red-50 text-red-700 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-mis-navy">
                  {asg.title}
                </h2>

                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {asg.description || 'No additional instructions.'}
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays size={16} />
                  Due: <strong>{asg.due_date || 'Not specified'}</strong>
                </div>

                {asg.attachment_url && (
                  <a
                    href={asg.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-mis-blue hover:underline"
                  >
                    <ExternalLink size={16} />
                    View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-slate-500"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-mis-navy mb-2">
                {editingId ? 'Edit Homework' : 'Add New Homework'}
              </h2>

              <p className="text-sm text-slate-500 mb-5">
                Students in the selected class will be able to view this homework.
              </p>

              <form onSubmit={handleSave} className="space-y-4">
                {saveError && (
                  <p role="alert" className="text-sm text-red-700">
                    {saveError}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Class & Subject
                  </label>

                  <select
                    value={selected?.id || ''}
                    onChange={e => setFormData({
                      ...formData,
                      assignmentId: e.target.value
                    })}
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                  >
                    {authorizedClasses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.grade} ({c.division}) — {c.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Homework Title
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({
                      ...formData,
                      title: e.target.value
                    })}
                    placeholder="e.g. English Chapter 2 Questions"
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Due Date
                  </label>

                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={e => setFormData({
                      ...formData,
                      dueDate: e.target.value
                    })}
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Homework Instructions
                  </label>

                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({
                      ...formData,
                      description: e.target.value
                    })}
                    placeholder="Write homework instructions..."
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Attachment Link (Optional)
                  </label>

                  <input
                    type="url"
                    value={formData.attachment_url}
                    onChange={e => setFormData({
                      ...formData,
                      attachment_url: e.target.value
                    })}
                    placeholder="https://example.com/homework.pdf"
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  />

                  <p className="text-xs text-slate-500 mt-1">
                    Paste a link to a PDF, image or document.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving || !authorizedClasses.length}
                  className="w-full py-3 bg-mis-navy text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Homework'
                      : 'Publish Homework'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default TeacherAssignments;
