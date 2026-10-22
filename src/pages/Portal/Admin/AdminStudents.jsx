
import React, { useState } from 'react';
import ClassAssignmentFields from '../../../components/portal/ClassAssignmentFields';
import usePortalQuery from '../../../hooks/usePortalQuery';
import { QueryState } from '../../../components/portal/PortalStates';
import AccountCredentials from '../../../components/portal/AccountCredentials';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { supabase } from '../../../services/supabase';
import {
  Plus,
  CheckCircle2,
  X,
  Search,
  ArrowUpCircle,
  Trash2,
  Pencil
} from 'lucide-react';

const emptyForm = {
  fullName: '',
  email: '',
  studentId: '',
  classId: '',
  rollNumber: '',
  fatherName: '',
  motherName: '',
  phone: '',
  dob: '',
  bloodGroup: '',
  address: ''
};

const AdminStudents = () => {
  const query = usePortalQuery(
    () => portalService.getStudents(),
    []
  );

  const students = query.data || [];

  const catalog = usePortalQuery(
    () => portalService.getProvisioningOptions(),
    [],
    { classes: [], subjects: [] }
  );

  const [account, setAccount] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState(emptyForm);

  // Promotion
  const [promotionStudent, setPromotionStudent] = useState(null);
  const [destinationClassId, setDestinationClassId] = useState('');
  const [newRollNumber, setNewRollNumber] = useState('');

  // Permanent deletion
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Admin-only student editing
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [editLoading, setEditLoading] = useState(false);

  const openEdit = async (student) => {
    if (saving || editLoading) return;
    setSaveError('');
    setEditLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('edit-student', {
        body: { action: 'get', studentId: student.id }
      });
      if (error) {
        let message = error.message;
        try {
          const body = await error.context?.json();
          message = body?.error || message;
        } catch (_) {}
        throw new Error(message);
      }
      if (!data?.student) throw new Error(data?.error || 'Student details unavailable.');
      setEditForm({
        fullName: data.student.fullName || '',
        email: data.student.email || '',
        studentId: data.student.studentId || '',
        classId: data.student.classId || '',
        rollNumber: String(data.student.rollNumber ?? ''),
        fatherName: data.student.fatherName || '',
        motherName: data.student.motherName || '',
        phone: data.student.phone || '',
        dob: data.student.dob || '',
        bloodGroup: data.student.bloodGroup || '',
        address: data.student.address || ''
      });
      setEditingStudent(student);
    } catch (error) {
      setSaveError(error.message || 'Unable to load student details.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const { data, error } = await supabase.functions.invoke('edit-student', {
        body: {
          action: 'update',
          studentId: editingStudent.id,
          changes: {
            ...editForm,
            rollNumber: Number(editForm.rollNumber)
          }
        }
      });
      if (error) {
        let message = error.message;
        try {
          const body = await error.context?.json();
          message = body?.error || message;
        } catch (_) {}
        throw new Error(message);
      }
      if (!data?.success) throw new Error(data?.error || 'Student update failed.');
      setSuccessMessage(`${editForm.fullName} updated successfully.`);
      setEditingStudent(null);
      await query.reload();
    } catch (error) {
      setSaveError(error.message || 'Student update failed.');
    } finally {
      setSaving(false);
    }
  };


  const classOptions = catalog.data?.classes || [];

  const gradeNumber = (value) => {
    const match = String(value ?? '').match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const yearStart = (value) => {
    const match = String(value ?? '').match(/\d{4}/);
    return match ? Number(match[0]) : null;
  };

  const eligibleClasses = promotionStudent
    ? classOptions.filter((c) => {
        const currentGrade = gradeNumber(promotionStudent.grade);

        const currentClass =
          classOptions.find(
            (x) => x.id === promotionStudent.classId
          ) ||
          classOptions.find(
            (x) =>
              String(x.grade_level) ===
                String(promotionStudent.grade) &&
              String(x.division) ===
                String(promotionStudent.division)
          );

        const oldYear = yearStart(currentClass?.academic_year);
        const newYear = yearStart(c.academic_year);

        return (
          currentGrade !== null &&
          gradeNumber(c.grade_level) === currentGrade + 1 &&
          oldYear !== null &&
          newYear === oldYear + 1
        );
      })
    : [];

  const openPromotion = (student) => {
    setSaveError('');
    setPromotionStudent(student);
    setDestinationClassId('');
    setNewRollNumber(String(student.rollNumber ?? ''));
  };

  const handlePromote = async (e) => {
    e.preventDefault();

    if (!promotionStudent || saving) return;

    const target = eligibleClasses.find(
      (c) => c.id === destinationClassId
    );

    const roll = Number(newRollNumber);

    if (!target) {
      setSaveError('Select a valid next-year class.');
      return;
    }

    if (!Number.isInteger(roll) || roll <= 0) {
      setSaveError('Enter a valid roll number.');
      return;
    }

    const confirmed = window.confirm(
      `Promote ${promotionStudent.fullName} to ` +
      `${target.grade_level}-${target.division} ` +
      `(${target.academic_year})?`
    );

    if (!confirmed) return;

    setSaving(true);
    setSaveError('');

    try {
      const { error } = await supabase.rpc('promote_student', {
        p_student_id: promotionStudent.id,
        p_new_class_id: destinationClassId,
        p_new_roll_number: roll
      });

      if (error) throw error;

      setSuccessMessage(
        `${promotionStudent.fullName} promoted successfully.`
      );

      setPromotionStudent(null);
      await query.reload();
    } catch (error) {
      setSaveError(error.message || 'Promotion failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setSaveError('');

    try {
      if (!formData.fullName || !formData.email) {
        throw new Error('Enter a name and email.');
      }

      if (!formData.classId) {
        throw new Error('Select a class and division.');
      }

      const credentials = await portalService.addStudent({
        ...formData,
        studentId: formData.studentId || undefined
      });

      setAccount(credentials);

      setSuccessMessage(
        `Account created successfully for ${formData.fullName}!`
      );

      setIsModalOpen(false);
      setFormData({ ...emptyForm });

      await query.reload();
    } catch (error) {
      setSaveError(error.message || 'Unable to add student.');
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async (student) => {
    if (saving) return;

    if (
      !window.confirm(
        `Reset the password for ${student.fullName}?`
      )
    ) {
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const result = await portalService.resetAccountPassword(
        student.user_id
      );

      setAccount({
        ...result,
        action: 'reset'
      });
    } catch (error) {
      setSaveError(error.message || 'Password reset failed.');
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (student) => {
    setSaveError('');
    setDeletingStudent(student);
    setDeleteConfirmation('');
  };

  const closeDelete = () => {
    if (saving) return;

    setDeletingStudent(null);
    setDeleteConfirmation('');
    setSaveError('');
  };

  const handleDeleteStudent = async (e) => {
    e.preventDefault();

    if (!deletingStudent || saving) return;

    if (
      deleteConfirmation.trim() !==
      String(deletingStudent.studentId)
    ) {
      setSaveError('Student ID does not match.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const { data, error } = await supabase.functions.invoke(
        'delete-student',
        {
          body: {
            studentId: deletingStudent.id
          }
        }
      );

      if (error) {
        let message = error.message;

        try {
          const response = await error.context?.json();
          message = response?.error || message;
        } catch (_) {
          // Use original error message.
        }

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(
          data?.error || 'Deletion was not confirmed.'
        );
      }

      const warnings = Array.isArray(data.warnings)
        ? data.warnings.filter(Boolean)
        : [];

      setSuccessMessage(
        `${deletingStudent.fullName} was deleted.` +
        (warnings.length
          ? ` Cleanup warnings: ${warnings.join('; ')}`
          : '')
      );

      setDeletingStudent(null);
      setDeleteConfirmation('');

      await query.reload();
    } catch (error) {
      setSaveError(
        error.message || 'Unable to delete student.'
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const search = searchTerm.toLowerCase();

    return (
      String(s.fullName || '').toLowerCase().includes(search) ||
      String(s.studentId || '').toLowerCase().includes(search) ||
      String(s.grade || '').toLowerCase().includes(search)
    );
  });

  const inputClass =
    'w-full px-3 py-2 rounded-xl border border-slate-200 ' +
    'outline-none focus:border-mis-blue';

  const updateForm = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <PortalLayout title="Student Account Provisioning & Management">
      <div className="space-y-6">

        <QueryState query={query} />

        {saveError && !deletingStudent && !promotionStudent && (
          <p role="alert" className="text-sm text-red-700">
            {saveError}
          </p>
        )}

        {account && (
          <AccountCredentials
            account={account}
            onClose={() => setAccount(null)}
          />
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-start justify-between gap-3">
            <span className="flex items-start gap-2">
              <CheckCircle2
                size={18}
                className="text-emerald-600 shrink-0"
              />
              {successMessage}
            </span>

            <button
              type="button"
              onClick={() => setSuccessMessage('')}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* HEADER */}
        <div className="card-surface p-6 bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-mis-blue bg-mis-soft px-2.5 py-1 rounded-full">
              Database-Driven Student Roster
            </span>

            <h2 className="text-xl font-extrabold text-mis-navy mt-2">
              Student Accounts ({students.length})
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or ID..."
                className="pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold w-full sm:w-56"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSaveError('');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-mis-navy text-white text-xs font-bold rounded-xl"
            >
              <Plus size={16} />
              Add Student
            </button>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <div className="card-surface p-6 bg-white border border-slate-200/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Account</th>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Grade & Division</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Father Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50/80"
                  >
                    <td className="p-3">
                      {st.username || 'Not assigned'}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => resetPassword(st)}
                        className="text-mis-blue underline disabled:opacity-50"
                      >
                        Reset Password
                      </button>
                    </td>

                    <td className="p-3 font-bold text-mis-blue">
                      {st.studentId}
                    </td>

                    <td className="p-3 font-bold text-mis-navy">
                      {st.fullName}
                    </td>

                    <td className="p-3 text-slate-500">
                      {st.email}
                    </td>

                    <td className="p-3">
                      {st.grade} ({st.division})
                    </td>

                    <td className="p-3 font-extrabold">
                      {st.rollNumber}
                    </td>

                    <td className="p-3">
                      {st.fatherName || 'Not specified'}
                    </td>

                    <td className="p-3">
                      {st.phone || 'Not available'}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          st.isActive
                            ? 'px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold'
                            : 'px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold'
                        }
                      >
                        {st.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={saving || editLoading}
                          onClick={() => openEdit(st)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 disabled:opacity-50"
                        >
                          <Pencil size={15} />
                          {editLoading ? 'Loading...' : 'Edit'}
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => openPromotion(st)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 disabled:opacity-50"
                        >
                          <ArrowUpCircle size={15} />
                          Promote
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => openDelete(st)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!filteredStudents.length && (
              <p className="text-center text-sm text-slate-500 py-8">
                No students found.
              </p>
            )}
          </div>
        </div>

        {/* EDIT STUDENT MODAL */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-mis-navy">Edit Student Details</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {editingStudent.fullName} — change details without creating a new login.
                  </p>
                </div>
                <button type="button" disabled={saving}
                  onClick={() => { setEditingStudent(null); setSaveError(''); }}
                  aria-label="Close edit form"><X size={20} /></button>
              </div>
              {saveError && <p role="alert" className="text-sm text-red-700 mb-3">{saveError}</p>}
              <form onSubmit={handleEditStudent} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['fullName', 'Full Name', 'text', true],
                    ['email', 'Email / Login', 'email', true],
                    ['studentId', 'Student ID', 'text', true],
                    ['rollNumber', 'Roll Number', 'number', true],
                    ['fatherName', 'Father / Guardian Name', 'text', false],
                    ['motherName', 'Mother Name', 'text', false],
                    ['phone', 'Parent Phone', 'tel', false],
                    ['dob', 'Date of Birth', 'date', false],
                    ['bloodGroup', 'Blood Group', 'text', false]
                  ].map(([name, label, type, required]) => (
                    <label key={name} className="block font-bold text-slate-700">
                      {label}
                      <input type={type} required={required}
                        min={name === 'rollNumber' ? '1' : undefined}
                        value={editForm[name]}
                        onChange={e => setEditForm(prev => ({ ...prev, [name]: e.target.value }))}
                        className="w-full px-3 py-2 mt-1 rounded-xl border border-slate-200 outline-none focus:border-mis-blue" />
                    </label>
                  ))}
                  <label className="block font-bold text-slate-700">
                    Class / Division (corrections only)
                    <select required value={editForm.classId}
                      onChange={e => setEditForm(prev => ({ ...prev, classId: e.target.value }))}
                      className="w-full px-3 py-2 mt-1 rounded-xl border border-slate-200">
                      <option value="">Select class</option>
                      {classOptions.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.grade_level} - {c.division} ({c.academic_year})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block font-bold text-slate-700">
                  Residential Address
                  <textarea rows={3} value={editForm.address}
                    onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 mt-1 rounded-xl border border-slate-200" />
                </label>
                <p className="text-xs text-slate-500">
                  To move a student to the next standard, use Promote instead of Edit.
                </p>
                <div className="flex gap-3">
                  <button type="button" disabled={saving}
                    onClick={() => { setEditingStudent(null); setSaveError(''); }}
                    className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving || !editForm.classId}
                    className="flex-1 px-4 py-2.5 bg-mis-navy text-white rounded-xl font-bold disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROMOTION MODAL */}
        {promotionStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-mis-navy">
                    Promote Student
                  </h3>

                  <p className="text-sm text-slate-600 mt-1">
                    {promotionStudent.fullName} —{' '}
                    {promotionStudent.grade} ({promotionStudent.division})
                  </p>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setPromotionStudent(null);
                    setSaveError('');
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {saveError && (
                <p role="alert" className="text-sm text-red-700 mb-3">
                  {saveError}
                </p>
              )}

              <form
                onSubmit={handlePromote}
                className="space-y-4"
              >
                <label className="block text-sm font-bold text-slate-700">
                  Next Standard / Division / Academic Year

                  <select
                    required
                    value={destinationClassId}
                    onChange={(e) =>
                      setDestinationClassId(e.target.value)
                    }
                    className={`${inputClass} mt-2`}
                  >
                    <option value="">
                      Select destination class
                    </option>

                    {eligibleClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.grade_level} - {c.division}{' '}
                        ({c.academic_year})
                      </option>
                    ))}
                  </select>
                </label>

                {!eligibleClasses.length && (
                  <p className="text-xs text-amber-700">
                    No eligible next-year class found.
                    Create the next academic year's class first.
                  </p>
                )}

                <label className="block text-sm font-bold text-slate-700">
                  New Roll Number

                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={newRollNumber}
                    onChange={(e) =>
                      setNewRollNumber(e.target.value)
                    }
                    className={`${inputClass} mt-2`}
                  />
                </label>

                <p className="text-xs text-slate-500">
                  The student keeps the same login and ID.
                  Promotion history is recorded.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setPromotionStudent(null);
                      setSaveError('');
                    }}
                    className="px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !eligibleClasses.length ||
                      !destinationClassId
                    }
                    className="flex-1 px-4 py-2.5 bg-mis-navy text-white rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {saving
                      ? 'Promoting...'
                      : 'Confirm Promotion'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
            <form
              onSubmit={handleDeleteStudent}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-extrabold text-red-700 flex items-center gap-2">
                  <Trash2 size={20} />
                  Delete Student
                </h3>

                <button
                  type="button"
                  disabled={saving}
                  onClick={closeDelete}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800 font-semibold">
                  This action is permanent and cannot be undone.
                </p>

                <p className="text-xs text-red-700 mt-2">
                  Deleting this student may permanently remove
                  their login, attendance, fees, results and
                  other linked academic records.
                </p>
              </div>

              <div className="text-sm space-y-2">
                <p>
                  <strong>Student:</strong>{' '}
                  {deletingStudent.fullName}
                </p>

                <p>
                  <strong>Student ID:</strong>{' '}
                  {deletingStudent.studentId}
                </p>

                <p>
                  <strong>Class:</strong>{' '}
                  {deletingStudent.grade} (
                  {deletingStudent.division})
                </p>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Type Student ID to confirm deletion

                <input
                  autoFocus
                  required
                  value={deleteConfirmation}
                  onChange={(e) =>
                    setDeleteConfirmation(e.target.value)
                  }
                  placeholder={String(deletingStudent.studentId)}
                  className={`${inputClass} mt-2`}
                />
              </label>

              {saveError && (
                <p role="alert" className="text-sm text-red-700">
                  {saveError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeDelete}
                  className="flex-1 py-3 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    deleteConfirmation.trim() !==
                      String(deletingStudent.studentId)
                  }
                  className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {saving
                    ? 'Deleting...'
                    : 'Delete Permanently'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADD STUDENT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-mis-navy mb-1">
                Provision New Student Account
              </h3>

              <p className="text-xs text-slate-500 mb-4">
                Creates a real student login and school profile.
              </p>

              <form
                onSubmit={handleCreateStudent}
                className="space-y-4 text-xs"
              >
                <QueryState query={catalog} />

                {saveError && (
                  <p role="alert" className="text-red-700">
                    {saveError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <label className="block font-bold text-slate-700">
                    Full Name

                    <input
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        updateForm('fullName', e.target.value)
                      }
                      className={`${inputClass} mt-1`}
                      placeholder="Student full name"
                    />
                  </label>

                  <label className="block font-bold text-slate-700">
                    Email Address

                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        updateForm('email', e.target.value)
                      }
                      className={`${inputClass} mt-1`}
                      placeholder="student@school.com"
                    />
                  </label>
                </div>

                <ClassAssignmentFields
                  classes={classOptions}
                  value={formData.classId}
                  disabled={catalog.loading}
                  onChange={(classId) =>
                    updateForm('classId', classId)
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <label className="block font-bold text-slate-700">
                    Roll Number

                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.rollNumber}
                      onChange={(e) =>
                        updateForm('rollNumber', e.target.value)
                      }
                      className={`${inputClass} mt-1`}
                    />
                  </label>

                  <label className="block font-bold text-slate-700">
                    Student ID (optional)

                    <input
                      value={formData.studentId}
                      onChange={(e) =>
                        updateForm('studentId', e.target.value)
                      }
                      className={`${inputClass} mt-1`}
                      placeholder="Auto-generated"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block font-bold text-slate-700">
                    Father / Guardian Name

                    <input
                      value={formData.fatherName}
                      onChange={(e) =>
                        updateForm('fatherName', e.target.value)
                      }
                      className={`${inputClass} mt-1`}
                    />
                  </label>

                  <label className="block font-bold text-slate-700">
                    Parent Phone

                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        updateForm('phone', e.target.value)
                      }
                      className={`${inputClass} mt-1`}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    catalog.loading ||
                    !!catalog.error ||
                    !classOptions.length
                  }
                  className="w-full py-3 bg-mis-navy text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {saving
                    ? 'Creating Student...'
                    : 'Confirm & Provision Student Account'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default AdminStudents;
