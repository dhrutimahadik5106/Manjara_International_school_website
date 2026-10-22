import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable, StatCard } from '../../../components/portal/PortalStates';
import { portalService } from '../../../services/portalService';
import React, { useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { Award, BookOpen } from 'lucide-react';

const PrincipalAcademics = () => {
  const query = usePortalQuery(() => portalService.getSchoolResults(), []);
  const groups = Object.values(query.data.reduce((acc,row)=>{ const className = `${row.students?.classes?.grade_level || 'Unassigned'} ${row.students?.classes?.division || ''}`; const key = `${className}|${row.subjects?.name}|${row.term}`; const g=acc[key] ||= { id:key,class:className,subject:row.subjects?.name,term:row.term,marks:0,max:0,count:0 }; g.marks+=Number(row.marks_obtained);g.max+=Number(row.max_marks);g.count++;return acc; },{})).map(g=>({...g, percentage:g.max ? Math.round(g.marks/g.max*100)+'%' : 'No data available'}));
  return <PortalLayout title="Academics"><div className="card-surface p-6 bg-white border border-slate-200 space-y-6"><h2 className="text-xl font-bold text-mis-navy">School Academics</h2><QueryState query={query} />{!query.loading && !query.error && <DataTable columns={[['class','Class'],['subject','Subject'],['term','Exam'],['count','Result records'],['percentage','Aggregate marks']]} rows={groups} empty="No results available." />}<p className="text-xs text-mis-muted">Reports display up to 1,000 authorized records.</p></div></PortalLayout>;
};

export default PrincipalAcademics;
