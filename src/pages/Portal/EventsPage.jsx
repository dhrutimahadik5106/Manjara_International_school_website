import React, {useState} from 'react';
import NoticeAudience,{SCHOOL_AUDIENCE} from '../../components/portal/NoticeAudience';
import PortalLayout from '../../components/portal/PortalLayout';
import { QueryState, DataTable } from '../../components/portal/PortalStates';
import { useAuth } from '../../context/AuthContext';
import usePortalQuery from '../../hooks/usePortalQuery';
import { portalService } from '../../services/portalService';
export default function EventsPage() {
  const { user } = useAuth();
  const query = usePortalQuery(()=>portalService.getEvents(), [user?.id], [], 30000);
  const [open,setOpen]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
  const empty={title:'',description:'',eventDate:'',location:'',targetRoles:SCHOOL_AUDIENCE};
  const [form,setForm]=useState(empty);
  const publish=async e=>{e.preventDefault();if(saving)return;setSaving(true);setError('');try{await portalService.addEvent(form);setOpen(false);setForm(empty);query.reload();window.dispatchEvent(new Event('portal-content-changed'));localStorage.setItem('portal-content-version',String(Date.now()));}catch{setError('Unable to publish this event. Check the details and your permissions.');}finally{setSaving(false);}};
  return <PortalLayout title="School Events"><div className="space-y-6"><h2 className="text-xl font-bold text-mis-navy">Upcoming School Events</h2>{user?.role==='admin'&&<button onClick={()=>setOpen(true)} className="px-4 py-2.5 bg-mis-navy text-white text-xs font-bold rounded-xl">Add Event</button>}
  {open&&user?.role==='admin'&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60"><form onSubmit={publish} className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4"><h3 className="font-bold text-lg">Add School Event</h3>{error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}{[['title','Title','text'],['eventDate','Date','date'],['location','Location','text']].map(([key,label,type])=><label key={key} className="block text-xs font-bold">{label}<input required={key!=='location'} type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full border border-slate-200 rounded-xl p-2 mt-1" /></label>)}<label className="block text-xs font-bold">Details<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border border-slate-200 rounded-xl p-2" /></label><NoticeAudience value={form.targetRoles} onChange={targetRoles=>setForm({...form,targetRoles})} /><button disabled={saving||!form.targetRoles.length} className="px-4 py-2 bg-mis-navy text-white rounded-xl">Publish Event</button><button type="button" className="ml-3 underline" onClick={()=>setOpen(false)}>Cancel</button></form></div>}
  <QueryState query={query} />{!query.loading && !query.error && <DataTable columns={[['title','Event'],['event_date','Date'],['location','Location'],['description','Details']]} rows={query.data} empty="No upcoming events." />}</div></PortalLayout>;
}
