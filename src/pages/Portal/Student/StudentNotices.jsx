import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable } from '../../../components/portal/PortalStates';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { Bell, Calendar, User, Sparkles } from 'lucide-react';

const StudentNotices = () => {
  const query = usePortalQuery(() => portalService.getStudentNotices(), [], [], 30000);
  const notices = query.data;
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);



  if (query.loading || query.error) return <PortalLayout title="Notices"><QueryState query={query} /></PortalLayout>;
  return (
    <PortalLayout title="Notices & Announcements">
      <div className="space-y-6">
        {!notices.length && <EmptyState>No notices available.</EmptyState>}
        <div className="card-surface p-6 bg-white border border-slate-200/90">
          <h2 className="text-xl font-bold text-mis-navy flex items-center gap-2">
            <Bell size={20} className="text-mis-gold" />
            Official School Circulars & Bulletins
          </h2>
          <p className="text-xs text-slate-500 mt-1">Important announcements published by school administration and academic coordinators.</p>
        </div>

        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="card-surface p-6 bg-white border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  {n.isImportant && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                      Important Notice
                    </span>
                  )}
                  <span className="text-xs font-bold text-mis-blue">{n.author}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar size={13} /> {n.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-mis-navy">{n.title}</h3>
              <p className="text-xs sm:text-sm text-mis-muted leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentNotices;
