import React from 'react';
import { useAuth } from '../../context/AuthContext';
import usePortalQuery from '../../hooks/usePortalQuery';
import { portalService, localDate } from '../../services/portalService';
import { QueryState, EmptyState } from './PortalStates';
export default function RecentPortalUpdates() {
  const { user } = useAuth();
  const query = usePortalQuery(async () => {
    const [notices, events, holidays] = await Promise.all([portalService.getStudentNotices(), portalService.getEvents(), portalService.getHolidays()]);
    return { notices, events, holidays: holidays.filter(h => (h.end_date || h.start_date) >= localDate()) };
  }, [user?.id], { notices: [], events: [], holidays: [] }, 30000);
  if (query.loading || query.error) return <QueryState query={query} />;
  return <div className="grid gap-6 lg:grid-cols-3">{[['notices','Recent notices'],['events','Upcoming events'],['holidays','School holidays']].map(([key,title]) => <section key={key} className="card-surface border border-slate-200 bg-white p-5"><h3 className="mb-4 font-bold text-mis-navy">{title}</h3>{!query.data[key].length ? <EmptyState>No {title.toLowerCase()}.</EmptyState> : query.data[key].slice(0,3).map(row=><article className="border-t border-slate-100 py-3" key={row.id}><p className="text-sm font-bold text-mis-navy">{row.title}</p><p className="mt-1 text-xs text-mis-muted">{row.date || row.event_date || row.start_date}</p><p className="mt-1 text-sm text-mis-muted">{row.content || row.description}</p></article>)}</section>)}</div>;
}
