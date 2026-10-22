import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import SchoolCalendar from '../../../components/portal/SchoolCalendar';

const ParentCalendar = () => {
  return (
    <PortalLayout title="School Calendar & Holidays">
      <SchoolCalendar currentRole="parent" isAdmin={false} />
    </PortalLayout>
  );
};

export default ParentCalendar;
