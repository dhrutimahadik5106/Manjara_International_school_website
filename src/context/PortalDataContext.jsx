import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import usePortalQuery from '../hooks/usePortalQuery';
import { portalService } from '../services/portalService';
const PortalDataContext = createContext(null);
const empty = { students: [], teacher: null };
export const PortalDataProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const query = usePortalQuery(() => user && !loading && !user.mustChangePassword ? portalService.getRoleDetails() : Promise.resolve(empty), [user?.id, user?.role, user?.mustChangePassword, loading], empty);
  const students = query.data?.students || [];
  const student = user?.role === 'student' ? students[0] : null;
  return <PortalDataContext.Provider value={{ ...query, ...query.data, student: student || null }}>{children}</PortalDataContext.Provider>;
};
export const usePortalData = () => useContext(PortalDataContext);
