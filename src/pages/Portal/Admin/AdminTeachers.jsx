import React, { useState } from 'react';
import ClassAssignmentFields from '../../../components/portal/ClassAssignmentFields';
import usePortalQuery from '../../../hooks/usePortalQuery';
import { QueryState } from '../../../components/portal/PortalStates';
import AccountCredentials from '../../../components/portal/AccountCredentials';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { supabase } from '../../../services/supabase';
import { Plus, CheckCircle2, X, Search, ShieldCheck, Pencil, Trash2 } from 'lucide-react';

const blank = { fullName: '', email: '', qualification: '', specialization: 'Mathematics', phone: '', classId: '', subjectId: '' };
const assignment = () => ({ classId: '', subjectId: '' });

const AdminTeachers = () => {
  const query = usePortalQuery(() => portalService.getTeachers(), []);
  const teachers = query.data || [];
  const catalog = usePortalQuery(() => portalService.getProvisioningOptions(), [], { classes: [], subjects: [] });
  const classes = catalog.data?.classes || [];
  const subjects = catalog.data?.subjects || [];
  const [account, setAccount] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ ...blank });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ ...blank });
  const [editAssignments, setEditAssignments] = useState([assignment()]);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const field = 'w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-mis-blue';

  const invoke = async (action, payload = {}) => {
    const { data, error } = await supabase.functions.invoke('manage-teacher', { body: { action, ...payload } });
    if (error) {
      let message = error.message;
      try { const details = await error.context?.json(); message = details?.error || message; } catch (_) {}
      throw new Error(message);
    }
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setSaveError('');
    try {
      if (!formData.fullName.trim() || !formData.email.trim()) throw new Error('Enter a name and email.');
      if (!formData.classId || !formData.subjectId) throw new Error('Select class, division and subject.');
      const credentials = await portalService.addTeacher({
        fullName: formData.fullName, email: formData.email.trim(),
        qualification: formData.qualification, specialization: formData.specialization,
        phone: formData.phone,
        assignedClasses: [{ classId: formData.classId, subjectId: formData.subjectId }]
      });
      setAccount(credentials);
      setSuccessMessage(`Teacher account created for ${formData.fullName}.`);
      setIsModalOpen(false); setFormData({ ...blank });
      await query.reload();
    } catch (error) { setSaveError(error.message); }
    finally { setSaving(false); }
  };

  const resetPassword = async (teacher) => {
    if (saving || !window.confirm(`Reset the password for ${teacher.fullName}?`)) return;
    setSaving(true); setSaveError('');
    try { setAccount({ ...await portalService.resetAccountPassword(teacher.user_id), action: 'reset' }); }
    catch (error) { setSaveError(error.message); }
    finally { setSaving(false); }
  };

  const openEdit = async (teacher) => {
    if (saving || loadingEdit) return;
    setSaveError(''); setLoadingEdit(true);
    try {
      const data = await invoke('get', { teacherId: teacher.id });
      const t = data.teacher;
      if (!t) throw new Error('Teacher not found.');
      setEditForm({ fullName: t.fullName || '', email: t.email || '', qualification: t.qualification || '', specialization: t.specialization || '', phone: t.phone || '' });
      setEditAssignments(t.assignedClasses?.length ? t.assignedClasses : [assignment()]);
      setEditing(teacher);
    } catch (error) { setSaveError(error.message); }
    finally { setLoadingEdit(false); }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing || saving) return;
    if (!editAssignments.length || editAssignments.some(a => !a.classId || !a.subjectId)) {
      setSaveError('Each assignment must have a class and subject.'); return;
    }
    const unique = new Set(editAssignments.map(a => `${a.classId}:${a.subjectId}`));
    if (unique.size !== editAssignments.length) { setSaveError('Remove duplicate class and subject assignments.'); return; }
    setSaving(true); setSaveError('');
    try {
      const data = await invoke('update', { teacherId: editing.id, changes: { ...editForm, assignedClasses: editAssignments } });
      if (!data?.success) throw new Error('Update was not confirmed.');
      setSuccessMessage(`${editForm.fullName} updated successfully.`);
      setEditing(null); await query.reload();
    } catch (error) { setSaveError(error.message); }
    finally { setSaving(false); }
  };

  const deleteTeacher = async (e) => {
    e.preventDefault();
    if (!deleting || saving || confirmation.trim() !== String(deleting.employeeId)) return;
    setSaving(true); setSaveError('');
    try {
      const data = await invoke('delete', { teacherId: deleting.id });
      if (!data?.success) throw new Error('Deletion was not confirmed.');
      setSuccessMessage(`${deleting.fullName} deleted successfully.`);
      setDeleting(null); setConfirmation(''); await query.reload();
    } catch (error) { setSaveError(error.message); }
    finally { setSaving(false); }
  };

  const filtered = teachers.filter(t => [t.fullName, t.email, t.employeeId].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase())));
  const setEdit = (key, value) => setEditForm(prev => ({ ...prev, [key]: value }));
  const editAssignment = (i, key, value) => setEditAssignments(prev => prev.map((a, n) => n === i ? { ...a, [key]: value } : a));
  const closeEdit = () => { if (!saving) { setEditing(null); setSaveError(''); } };

  return (
    <PortalLayout title="Teacher Official Email Provisioning & Class Assignments">
      <div className="space-y-6">
        <QueryState query={query} />
        {saveError && !editing && !deleting && <p role="alert" className="text-sm text-red-700">{saveError}</p>}
        {account && <AccountCredentials account={account} onClose={() => setAccount(null)} />}
        {successMessage && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between"><span className="flex items-center gap-2"><CheckCircle2 size={18}/>{successMessage}</span><button onClick={() => setSuccessMessage('')}><X size={16}/></button></div>}
        <div className="card-surface p-6 bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div><span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max mb-1"><ShieldCheck size={14}/> Official School Email Provisioning</span><h2 className="text-xl font-extrabold text-mis-navy">Faculty Accounts ({teachers.length})</h2></div>
          <div className="flex items-center gap-3 w-full sm:w-auto"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-slate-400"/><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search teacher or email..." className="pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold w-full sm:w-56"/></div><button onClick={() => { setSaveError(''); setIsModalOpen(true); }} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-mis-navy text-white text-xs font-bold rounded-xl"><Plus size={16}/> Add Teacher</button></div>
        </div>
        <div className="card-surface p-6 bg-white border border-slate-200/90"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200"><tr>{['Username','Account','Employee ID','Teacher Name','Official School Email','Qualification','Assigned Classes & Subjects','Actions'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 font-semibold text-slate-700">{filtered.map(t => <tr key={t.id} className="hover:bg-slate-50/80"><td className="p-3">{t.username || 'Not assigned'}</td><td className="p-3"><button disabled={saving} onClick={() => resetPassword(t)} className="text-mis-blue underline">Reset Password</button></td><td className="p-3 font-bold text-mis-navy">{t.employeeId}</td><td className="p-3 font-bold text-slate-900">{t.fullName}</td><td className="p-3 text-mis-blue font-bold">{t.email}</td><td className="p-3">{t.qualification}</td><td className="p-3"><div className="flex flex-wrap gap-1">{t.assignedClasses?.map((c,i) => <span key={i} className="px-2 py-0.5 rounded bg-mis-soft text-mis-blue font-bold text-[10px]">{c.grade}-{c.division} ({c.subject})</span>)}</div></td><td className="p-3"><div className="flex gap-2"><button disabled={saving || loadingEdit} onClick={() => openEdit(t)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold disabled:opacity-50"><Pencil size={14}/> Edit</button><button disabled={saving} onClick={() => { setSaveError(''); setDeleting(t); setConfirmation(''); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold disabled:opacity-50"><Trash2 size={14}/> Delete</button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="p-5 text-center text-sm text-slate-500">No teachers found.</p>}</div></div>
        {editing && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 overflow-y-auto"><div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-mis-navy">Edit Teacher</h3><button disabled={saving} onClick={closeEdit}><X size={20}/></button></div>{saveError && <p role="alert" className="text-sm text-red-700 mb-3">{saveError}</p>}<form onSubmit={saveEdit} className="space-y-4 text-sm"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[['fullName','Full Name','text'],['email','Official School Email','email'],['qualification','Qualification','text'],['specialization','Specialization','text'],['phone','Phone Number','tel']].map(([key,label,type]) => <label key={key} className="block font-bold text-slate-700">{label}<input type={type} required={key === 'fullName' || key === 'email'} value={editForm[key]} onChange={e => setEdit(key,e.target.value)} className={`${field} mt-1`}/></label>)}</div><div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"><div className="flex justify-between items-center"><h4 className="font-bold text-mis-navy">Assigned Classes & Subjects</h4><button type="button" onClick={() => setEditAssignments(prev => [...prev,assignment()])} className="text-mis-blue font-bold flex items-center gap-1"><Plus size={15}/> Add Class</button></div>{editAssignments.map((a,i) => <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end"><label className="font-semibold">Class & Division<select required value={a.classId} onChange={e => editAssignment(i,'classId',e.target.value)} className={field}><option value="">Select class</option>{classes.map(c => <option key={c.id} value={c.id}>{c.grade_level} - {c.division} ({c.academic_year})</option>)}</select></label><label className="font-semibold">Subject<select required value={a.subjectId} onChange={e => editAssignment(i,'subjectId',e.target.value)} className={field}><option value="">Select subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label><button type="button" disabled={editAssignments.length === 1} onClick={() => setEditAssignments(prev => prev.filter((_,n) => n !== i))} className="p-2 text-red-700 disabled:opacity-40" aria-label="Remove assignment"><Trash2 size={18}/></button></div>)}</div><p className="text-xs text-slate-500">Changes to assigned classes affect teacher permissions. Historical academic records remain unchanged.</p><div className="flex gap-3"><button type="button" disabled={saving} onClick={closeEdit} className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold">Cancel</button><button type="submit" disabled={saving || !editAssignments.length} className="flex-1 px-4 py-2.5 bg-mis-navy text-white rounded-xl font-bold disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button></div></form></div></div>}
        {deleting && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60"><form onSubmit={deleteTeacher} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"><div className="flex justify-between"><h3 className="text-lg font-bold text-red-700 flex items-center gap-2"><Trash2 size={20}/> Delete Teacher</h3><button type="button" disabled={saving} onClick={() => { setDeleting(null); setSaveError(''); }}><X size={20}/></button></div><p className="text-sm text-red-700">Permanent deletion removes the teacher login and linked teacher data. If historical records reference this teacher, deletion will be blocked for safety.</p><p className="text-sm"><strong>{deleting.fullName}</strong> — Employee ID: <strong>{deleting.employeeId}</strong></p><label className="block text-sm font-bold">Type Employee ID to confirm<input required autoFocus value={confirmation} onChange={e => setConfirmation(e.target.value)} placeholder={String(deleting.employeeId)} className={`${field} mt-2`}/></label>{saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}<div className="flex gap-3"><button type="button" disabled={saving} onClick={() => { setDeleting(null); setSaveError(''); }} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button><button type="submit" disabled={saving || confirmation.trim() !== String(deleting.employeeId)} className="flex-1 py-3 bg-red-700 text-white rounded-xl font-bold disabled:opacity-50">{saving ? 'Deleting...' : 'Delete Permanently'}</button></div></form></div>}
        {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 overflow-y-auto"><div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8"><button disabled={saving} onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4"><X size={18}/></button><h3 className="text-lg font-bold text-mis-navy mb-1">Provision Official Teacher Account</h3><p className="text-xs text-slate-500 mb-4">Creates faculty profile and class/subject permissions.</p><form onSubmit={handleCreateTeacher} className="space-y-4 text-xs"><QueryState query={catalog}/>{saveError && <p role="alert" className="text-red-700">{saveError}</p>}<div className="grid grid-cols-2 gap-3">{[['fullName','Teacher Full Name'],['email','Official School Email'],['qualification','Qualifications'],['specialization','Specialization'],['phone','Phone']].map(([key,label]) => <label key={key} className="font-bold text-slate-700">{label}<input type={key === 'email' ? 'email' : 'text'} required={key === 'fullName' || key === 'email'} value={formData[key]} onChange={e => setFormData(prev => ({ ...prev,[key]:e.target.value }))} className={`${field} mt-1`}/></label>)}</div><div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"><span className="block font-bold text-mis-navy">Assign Class & Subject Permission</span><ClassAssignmentFields classes={classes} value={formData.classId} disabled={catalog.loading} onChange={classId => setFormData(prev => ({ ...prev,classId }))}/><label className="block font-bold text-slate-700">Subject<select required value={formData.subjectId} onChange={e => setFormData(prev => ({ ...prev,subjectId:e.target.value }))} className={field}><option value="">Select subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div><button type="submit" disabled={saving || catalog.loading || !!catalog.error || !classes.length} className="w-full py-2.5 bg-mis-navy text-white font-bold rounded-xl disabled:opacity-50">{saving ? 'Creating...' : 'Provision Official Teacher Account'}</button></form></div></div>}
      </div>
    </PortalLayout>
  );
};

export default AdminTeachers;
