import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import SchoolCalendar from '../../../components/portal/SchoolCalendar';

const TeacherCalendar = () => {
  return (
    <PortalLayout title="School Calendar & Academic Holidays">
      <SchoolCalendar currentRole="teacher" isAdmin={false} />
    </PortalLayout>
  );
};

export default TeacherCalendar;
