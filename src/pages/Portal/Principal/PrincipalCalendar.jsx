import React from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import SchoolCalendar from '../../../components/portal/SchoolCalendar';

const PrincipalCalendar = () => {
  return (
    <PortalLayout title="Institutional Academic Calendar">
      <SchoolCalendar currentRole="principal" isAdmin={false} />
    </PortalLayout>
  );
};

export default PrincipalCalendar;
