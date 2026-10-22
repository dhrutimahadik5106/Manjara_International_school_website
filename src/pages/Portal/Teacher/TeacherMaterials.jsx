import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable, StatCard } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { FolderOpen, Upload, FileText } from 'lucide-react';

const TeacherMaterials = () => {
  const { teacher } = usePortalData();
  const classes = teacher?.assignedClasses || [];
  const query = usePortalQuery(() => portalService.getTeacherMaterials(), [teacher?.id]);
  const materials = query.data;
  const [open,setOpen] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [form,setForm] = useState({ assignmentId:'', title:'', description:'', file_url:'' });
  const [file,setFile] = useState(null);
  const publish = async e => {
    e.preventDefault(); const selected = classes.find(c=>c.id===form.assignmentId) || classes[0]; if (!selected || saving) return;
    setSaving(true);setError('');
    try { const file_url = file ? await portalService.uploadFile(file) : form.file_url; await portalService.publishMaterial({ ...form, class_id:selected.class_id,subject_id:selected.subject_id,file_url,file_type:file?.type || null });setOpen(false);setFile(null);setForm({assignmentId:'',title:'',description:'',file_url:''});query.reload(); }
    catch(e){setError(e.message);}finally{setSaving(false);}
  };

  return (
    <PortalLayout title="Study Materials & Class Notes">
      <div className="space-y-6">
        <div className="card-surface p-6 bg-white border border-slate-200/90 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-mis-navy">Upload Study Material</h2>
            <p className="text-xs text-mis-muted mt-1">Publish notes, PDF worksheets, and revision decks for students.</p>
          </div>
          <button onClick={()=>setOpen(true)} disabled={!classes.length} className="px-4 py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow">
            <Upload size={16} /> Publish Material
          </button>
        </div>

        <QueryState query={query} empty={!materials.length}>No study material available.</QueryState>
        {open && <form onSubmit={publish} className="card-surface bg-white border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-mis-navy">Publish to an assigned class</h3>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <label className="block text-sm">Class and subject<select className="block w-full p-2 border rounded-xl" value={form.assignmentId || classes[0]?.id || ''} onChange={e=>setForm({...form,assignmentId:e.target.value})}>{classes.map(c=><option key={c.id} value={c.id}>{c.grade} {c.division} ? {c.subject}</option>)}</select></label>
          <label className="block text-sm">Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="block w-full p-2 border rounded-xl" /></label>
          <label className="block text-sm">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="block w-full p-2 border rounded-xl" /></label>
          <label className="block text-sm">Secure file link<input type="url" pattern="https://.*" required={!file} value={form.file_url} onChange={e=>setForm({...form,file_url:e.target.value})} className="block w-full p-2 border rounded-xl" /></label>
          {import.meta.env.VITE_PORTAL_STORAGE_BUCKET && <label className="block text-sm">Or upload PDF, DOCX, JPG or PNG (up to 10 MB)<input type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={e=>setFile(e.target.files?.[0] || null)} className="block mt-2" /></label>}
          <button disabled={saving} className="px-4 py-2 bg-mis-navy text-white rounded-xl">{saving ? 'Publishing...' : 'Publish'}</button><button type="button" onClick={()=>setOpen(false)} className="ml-3 text-sm">Cancel</button>
        </form>}
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((m) => (
            <div key={m.id} className="card-surface p-5 bg-white border border-slate-200/90 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-mis-soft text-mis-blue text-[10px] font-bold uppercase">
                {m.subjects?.name}
              </span>
              <FileLink value={m.file_url} />
              <h3 className="text-base font-bold text-mis-navy">{m.title}</h3>
              <p className="text-xs text-slate-500">Uploaded on: {m.created_at?.slice(0,10)}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default TeacherMaterials;
