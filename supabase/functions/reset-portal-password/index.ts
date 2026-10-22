import {withPasswordLock,client,reply,serve,identity,password} from '../_shared/auth.ts';
serve(async req => {
 const admin=client(true), user=await identity(req,admin);
 const {data:caller}=await admin.from('profiles').select('role,is_active').eq('id',user.id).single();
 if(caller?.role!=='admin'||!caller.is_active) return reply(403,{error:'Administrator access required.'});
 const {userId}=await req.json();
 return withPasswordLock(admin,userId,async () => {
 const {data:target}=await admin.from('profiles').select('id,username,role,full_name,is_active').eq('id',userId).single();
 if(!target?.username||!target.is_active||!['student','teacher'].includes(target.role)) return reply(400,{error:'Select an active student or teacher.'});
 const revision=crypto.randomUUID();
 const {error:markError}=await admin.from('profiles').update({password_change_token:revision}).eq('id',target.id);
 if(markError) throw markError;
 const temporaryPassword=password();
 const {error}=await admin.auth.admin.updateUserById(target.id,{password:temporaryPassword});
 if(error) throw error;
 const {data:latest}=await admin.from('profiles').select('password_change_token').eq('id',target.id).single();
 if(latest?.password_change_token!==revision) return reply(409,{error:'Another reset occurred. Reset the password again.'});
 return reply(200,{id:target.id,fullName:target.full_name,role:target.role,username:target.username,temporaryPassword});
 });
});
