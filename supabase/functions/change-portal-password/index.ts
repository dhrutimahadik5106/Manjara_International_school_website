import {withPasswordLock,client,reply,serve,identity,tokens} from '../_shared/auth.ts';
serve(async req => {
 const admin=client(true), user=await identity(req,admin);
 const {currentPassword,newPassword}=await req.json();
 if(typeof currentPassword!=='string'||typeof newPassword!=='string'||newPassword.length<12||newPassword.length>128||!/[A-Z]/.test(newPassword)||!/[a-z]/.test(newPassword)||!/[0-9]/.test(newPassword)||!/[\W_]/.test(newPassword)||newPassword===currentPassword) return reply(400,{error:'Choose a different password with at least 12 characters, uppercase, lowercase, a number and a symbol.'});
 return withPasswordLock(admin,user.id,async () => {
 const {data:profile}=await admin.from('profiles').select('role,is_active,password_change_token').eq('id',user.id).single();
 if(!profile?.is_active||!profile.password_change_token||!['student','teacher'].includes(profile.role)||!user.email) return reply(403,{error:'Password change is unavailable.'});
 const auth=client();
 const {data:login,error}=await auth.auth.signInWithPassword({email:user.email,password:currentPassword});
 if(error||login.user?.id!==user.id) return reply(401,{error:'Current password is incorrect.'});
 const {error:updateError}=await auth.auth.updateUser({password:newPassword});
 if(updateError) throw updateError;
 const {data:cleared,error:clearError}=await admin.from('profiles').update({password_change_token:null}).eq('id',user.id).eq('password_change_token',profile.password_change_token).select('id').maybeSingle();
 if(clearError||!cleared) return reply(409,{error:'Your password was reset again. Sign in with the latest credentials.'});
 const {data:session}=await auth.auth.getSession();
 if(!session.session) throw new Error('session');
 return reply(200,tokens(session.session));
 });
});
