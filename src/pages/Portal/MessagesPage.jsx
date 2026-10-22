import React from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { EmptyState } from '../../components/portal/PortalStates';
export default function MessagesPage() {
  return <PortalLayout title="Messages"><EmptyState>Messaging is not configured for this portal. Please contact the school through its existing contact channels.</EmptyState></PortalLayout>;
}
