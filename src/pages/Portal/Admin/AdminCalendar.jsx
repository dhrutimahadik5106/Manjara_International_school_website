import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import SchoolCalendar from '../../../components/portal/SchoolCalendar';

const AdminCalendar = () => {
  return (
    <PortalLayout title="School Calendar & Holiday Administration">
      <SchoolCalendar currentRole="admin" isAdmin={true} />
    </PortalLayout>
  );
};

export default AdminCalendar;
