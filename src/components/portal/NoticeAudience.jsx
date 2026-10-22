export const SCHOOL_AUDIENCE = ['student','teacher','principal'];
export default function NoticeAudience({value,onChange}) {
 return <fieldset className="space-y-2"><legend className="text-xs font-bold text-slate-700">Audience</legend><div className="flex flex-wrap gap-4">{SCHOOL_AUDIENCE.map(role=><label key={role} className="text-sm flex items-center gap-2"><input type="checkbox" checked={value.includes(role)} onChange={e=>onChange(e.target.checked?[...value,role]:value.filter(r=>r!==role))} />{role==='principal'?'Principal':role==='student'?'Students':'Teachers'}</label>)}</div></fieldset>;
}
