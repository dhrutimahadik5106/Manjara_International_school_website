import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
export const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
export const reply = (status:number, body:object) => new Response(JSON.stringify(body), {status, headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
export const client = (privileged=false) => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get(privileged ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY')!, {auth:{persistSession:false,autoRefreshToken:false}});
export const password = () => 'Aa9!' + Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,'0')).join('');
export async function identity(req:Request, admin:ReturnType<typeof client>) {
 const token=req.headers.get('Authorization')?.match(/^Bearer (.+)$/i)?.[1];
 if (!token) throw new Error('unauthorized');
 const {data,error}=await admin.auth.getUser(token);
 if(error || !data.user) throw new Error('unauthorized');
 return data.user;
}
export function serve(handler:(req:Request)=>Promise<Response>) {
 Deno.serve(async req => {
  if(req.method==='OPTIONS') return new Response(null,{headers:cors});
  if(req.method!=='POST') return reply(405,{error:'Method not allowed.'});
  if(Number(req.headers.get('content-length')||0)>16384) return reply(413,{error:'Request too large.'});
  try { return await handler(req); } catch { return reply(400,{error:'Unable to complete this request.'}); }
 });
}
export const tokens=(session:any)=>({access_token:session.access_token,refresh_token:session.refresh_token});

// Durable lock: a terminated function fails closed until an operator clears its stale lock.
export async function withPasswordLock(admin:ReturnType<typeof client>, accountId:string, action:()=>Promise<Response>) {
 const operation=crypto.randomUUID();
 const args={account_id:accountId,operation_id:operation};
 const {data,error}=await admin.rpc('begin_portal_password_operation',args);
 if(error||data!==true) return reply(409,{error:'A password operation is already in progress. Please contact the school administrator if it persists.'});
 try {return await action();}
 finally {await admin.rpc('end_portal_password_operation',args);}
}
