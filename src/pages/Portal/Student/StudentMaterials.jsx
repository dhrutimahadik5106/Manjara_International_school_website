import useStudentRecords from '../../../hooks/useStudentRecords';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { portalService } from '../../../services/portalService';
import { FolderOpen, Download, FileText, User } from 'lucide-react';

const StudentMaterials = () => {
  const { user } = useAuth();
  const query = useStudentRecords('getStudentMaterials');
  const { data: materials, student } = query;
  const studentId = student?.studentId || 'Not assigned';
  const grade = student?.grade || 'Not assigned';
  if (query.loading || query.error) return <PortalLayout title="Materials"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Study Materials & Resources">
      <div className="space-y-6">
        {!materials.length && <EmptyState>No materials records available.</EmptyState>}
        <div className="card-surface p-6 bg-white border border-slate-200/90">
          <h2 className="text-xl font-bold text-mis-navy flex items-center gap-2">
            <FolderOpen size={20} className="text-mis-blue" />
            Teacher Uploaded Notes & Study Files
          </h2>
          <p className="text-xs text-slate-500 mt-1">Download chapter summaries, practice sheets, and reference materials for {grade}.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {materials.map((mat) => (
            <div key={mat.id} className="card-surface p-6 bg-white border border-slate-200/90 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-mis-soft text-mis-blue text-xs font-bold uppercase">
                    {mat.subjects?.name}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{mat.fileType} • {mat.fileSize}</span>
                </div>

                <h3 className="text-base font-bold text-mis-navy">{mat.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Uploaded by {mat.teachers?.profiles?.full_name} on {mat.created_at?.slice(0,10)}</p>
              </div>

              <FileLink value={mat.file_url}>Download Study Material</FileLink>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentMaterials;
