import React from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { DataTable } from '../../components/portal/PortalStates';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
export default function ProfilePage() {
  const { user } = useAuth(); const { teacher } = usePortalData();
  return <PortalLayout title="My Profile"><div className="space-y-6"><section className="card-surface bg-white border border-slate-200 p-6"><h2 className="text-xl font-bold text-mis-navy">{user?.fullName}</h2><p className="mt-2 text-sm text-mis-muted">{user?.email}</p><p className="mt-2 text-sm capitalize">{user?.role}</p></section><DataTable columns={[['label','Information'],['value','Details']]} rows={[{id:'phone',label:'Phone',value:user?.details?.phone_number || 'Not available'},...(teacher ? [{id:'employee',label:'Employee ID',value:teacher.employeeId},{id:'qualification',label:'Qualification',value:teacher.qualification},{id:'specialization',label:'Specialization',value:teacher.specialization}] : [])]} /></div></PortalLayout>;
}
