import { usePortalData } from '../context/PortalDataContext';
import usePortalQuery from './usePortalQuery';
import { portalService } from '../services/portalService';
export default function useStudentRecords(method) {
  const { student } = usePortalData();
  const query = usePortalQuery(() => student ? portalService[method](student.id) : Promise.resolve([]), [student?.id, method]);
  return { ...query, student };
}
