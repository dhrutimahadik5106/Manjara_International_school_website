import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import SchoolCalendar from '../../../components/portal/SchoolCalendar';

const StudentCalendar = () => {
  return (
    <PortalLayout title="Academic School Calendar">
      <SchoolCalendar currentRole="student" isAdmin={false} />
    </PortalLayout>
  );
};

export default StudentCalendar;
