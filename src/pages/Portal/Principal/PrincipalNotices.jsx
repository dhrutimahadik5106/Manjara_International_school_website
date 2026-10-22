import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable } from '../../../components/portal/PortalStates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Bell, Plus, X } from 'lucide-react';

const PrincipalNotices = () => {
  const query = usePortalQuery(() => portalService.getStudentNotices(), [], [], 30000);
  const notices = query.data;
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', isImportant: true });



  const handlePublish = async (e) => {
    e.preventDefault();
    setSaveError(''); setSaving(true);
    try {
    await portalService.addNotice({
      title: formData.title,
      content: formData.content,
      isImportant: formData.isImportant,
      author: 'Principal Office'
    });
    setIsOpen(false);
    query.reload();
    } catch { setSaveError('Unable to publish this notice. Please check your permissions and retry.'); }
    finally { setSaving(false); }
  };

  if (query.loading || query.error) return <PortalLayout title="Notices"><QueryState query={query} /></PortalLayout>;
  return (
    <PortalLayout title="Official Circulars & Announcements">
      <div className="space-y-6">
        {!notices.length && <EmptyState>No notices available.</EmptyState>}
        {saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}
        <div className="card-surface p-6 bg-white border border-slate-200/90 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-mis-navy">School-Wide Circulars</h2>
            <p className="text-xs text-mis-muted mt-1">Publish official announcements for students and teachers.</p>
          </div>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow">
            <Plus size={16} /> Publish Circular
          </button>
        </div>

        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="card-surface p-6 bg-white border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-mis-blue px-3 py-1 bg-mis-soft rounded-full">{n.author}</span>
                <span className="text-xs text-slate-400 font-semibold">{n.date}</span>
              </div>
              <h3 className="text-lg font-bold text-mis-navy">{n.title}</h3>
              <p className="text-xs text-mis-muted leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold text-mis-navy mb-4">Publish Circular</h3>
              <form onSubmit={handlePublish} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Circular Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-mis-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-mis-blue outline-none"
                  />
                </div>
                <button type="submit" disabled={saving} className="w-full py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition shadow">
                  Publish to School Portal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PrincipalNotices;
