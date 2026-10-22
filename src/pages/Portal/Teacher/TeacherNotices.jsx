import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable } from '../../../components/portal/PortalStates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Bell, Clock } from 'lucide-react';

const TeacherNotices = () => {
  const query = usePortalQuery(() => portalService.getStudentNotices(), [], [], 30000);
  const notices = query.data;
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);



  if (query.loading || query.error) return <PortalLayout title="Notices"><QueryState query={query} /></PortalLayout>;
  return (
    <PortalLayout title="Teacher Notices & Circulars">
      <div className="space-y-6">
        {!notices.length && <EmptyState>No notices available.</EmptyState>}
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="card-surface p-6 bg-white border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-mis-blue px-3 py-1 bg-mis-soft rounded-full">
                  {n.author}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{n.date}</span>
              </div>
              <h3 className="text-lg font-bold text-mis-navy">{n.title}</h3>
              <p className="text-xs text-mis-muted leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default TeacherNotices;
