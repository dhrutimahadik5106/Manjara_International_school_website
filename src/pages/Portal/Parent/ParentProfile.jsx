import usePortalQuery from '../../../hooks/usePortalQuery';
import { usePortalData } from '../../../context/PortalDataContext';
import { QueryState, EmptyState, DataTable, StatCard } from '../../../components/portal/PortalStates';
import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { UserCheck, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const ParentProfile = () => {
  const { user } = useAuth();
  const { parent, student } = usePortalData();

  return (
    <PortalLayout title="Parent & Guardian Profile">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="card-surface p-6 sm:p-8 bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
            alt={user?.fullName}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-mis-soft shadow"
          />
          <div className="text-center sm:text-left space-y-1">
            <span className="px-3 py-1 bg-mis-soft text-mis-blue text-xs font-bold uppercase rounded-full">
              Parent Account
            </span>
            <h2 className="text-2xl font-extrabold text-mis-navy">{user?.fullName || 'Parent'}</h2>
            <p className="text-xs text-slate-500 font-semibold">{user?.email || ''}</p>
          </div>
        </div>

        <div className="card-surface p-6 bg-white border border-slate-200/90 space-y-4">
          <h3 className="text-sm font-extrabold text-mis-navy uppercase tracking-wider border-b border-slate-100 pb-2">
            Contact & Verification Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-semibold mb-1">Occupation</span>
              <strong className="text-mis-navy text-sm font-bold">{parent?.occupation || 'Not available'}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-semibold mb-1">Registered Phone</span>
              <strong className="text-mis-navy text-sm font-bold">{user?.details?.phone_number || 'Not available'}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block font-semibold mb-1">Selected Child Address</span>
              <strong className="text-mis-navy text-sm font-bold">{student?.address || 'Not available'}</strong>
            </div>
          </div>
        </div>
        <DataTable columns={[['fullName','Child name'],['email','Email'],['studentId','Student ID'],['grade','Class'],['division','Division'],['academicYear','Academic year']]} rows={student ? [student] : []} empty="No child is linked to this account." />
      </div>
    </PortalLayout>
  );
};

export default ParentProfile;
