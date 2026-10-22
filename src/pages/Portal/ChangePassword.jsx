import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function ChangePassword() {
 const {user,changePassword,logout}=useAuth();
 const navigate=useNavigate();
 const [current,setCurrent]=useState(''),[next,setNext]=useState(''),[confirm,setConfirm]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 if(!user.mustChangePassword) return <Navigate replace to={`/portal/${user.role}/dashboard`} />;
 const submit=async e=>{
  e.preventDefault(); if(busy) return;
  if(next!==confirm) {setError('The new passwords do not match.');return;}
  if(next===current||next.length<12||!/[A-Z]/.test(next)||!/[a-z]/.test(next)||!/[0-9]/.test(next)||!/[\W_]/.test(next)) {setError('Choose a different password with at least 12 characters, uppercase, lowercase, a number and a symbol.');return;}
  setBusy(true);setError('');
  try {const account=await changePassword(current,next);setCurrent('');setNext('');setConfirm('');navigate(`/portal/${account.role}/dashboard`,{replace:true});}
  catch(e){setError(e.message);}finally{setBusy(false);}
 };
 return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><form onSubmit={submit} className="bg-white rounded-2xl shadow p-8 max-w-md w-full space-y-4"><h1 className="text-2xl font-bold text-mis-navy">Choose your password</h1><p>Before opening your school portal, replace your temporary password. Use at least 12 characters with uppercase, lowercase, a number and a symbol.</p>{[['Temporary password',current,setCurrent,'current-password'],['New password',next,setNext,'new-password'],['Confirm new password',confirm,setConfirm,'new-password']].map(([label,value,set,auto])=><label key={label} className="block text-sm font-semibold">{label}<input type="password" required maxLength={128} autoComplete={auto} value={value} onChange={e=>set(e.target.value)} className="block border rounded-xl p-3 w-full mt-1" /></label>)}{error&&<p role="alert" className="text-red-600">{error}</p>}<button disabled={busy} className="bg-mis-navy text-white rounded-xl px-4 py-3">{busy?'Saving...':'Save password'}</button><button type="button" disabled={busy} onClick={logout} className="ml-4 underline">Sign out</button></form></main>;
}
