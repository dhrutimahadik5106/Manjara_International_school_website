import useStudentRecords from '../../../hooks/useStudentRecords';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState } from '../../../components/portal/PortalStates';
import FileLink from '../../../components/portal/FileLink';
import React, { useState, useEffect } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

const ParentAssignments = () => {
  const query = useStudentRecords('getStudentAssignments');
  const { data: assignments, student } = query;
  const studentId = student?.studentId || 'Not assigned';
  const grade = student?.grade || 'Not assigned';
  if (query.loading || query.error) return <PortalLayout title="Assignments"><QueryState query={query} /></PortalLayout>;

  return (
    <PortalLayout title="Child Assignments & Homework">
      <div className="space-y-6">
        {!assignments.length && <EmptyState>No assignments records available.</EmptyState>}
        <div className="grid gap-6 md:grid-cols-2">
          {assignments.map((asg) => (
            <div key={asg.id} className="card-surface p-6 bg-white border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-mis-soft text-mis-blue text-xs font-bold uppercase">
                  {asg.subject}
                </span>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                  asg.status === 'submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {asg.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-mis-navy">{asg.title}</h3>
              <p className="text-xs text-mis-muted leading-relaxed">{asg.description}</p>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div>Assigned by: <strong>{asg.teacherName}</strong></div>
                <div>Due Date: <strong className="text-mis-navy">{asg.dueDate}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default ParentAssignments;
