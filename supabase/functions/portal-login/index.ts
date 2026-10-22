import {client,reply,serve,tokens} from '../_shared/auth.ts';
serve(async req => {
 const input=await req.json();
 const username=typeof input.username==='string'?input.username.trim().toUpperCase():'';
 const invalid=()=>reply(401,{error:'Invalid username or password.'});
 if(!/^[A-Z0-9-]{3,64}$/.test(username)||typeof input.password!=='string'||input.password.length>256) return invalid();
 const admin=client(true);
 const {data:profile,error}=await admin.from('profiles').select('id,role,is_active').eq('username',username).maybeSingle();
 if(error||!profile||!profile.is_active||!['student','teacher'].includes(profile.role)) return invalid();
 const {data:account,error:accountError}=await admin.auth.admin.getUserById(profile.id);
 if(accountError||!account.user?.email) return invalid();
 const {data,error:loginError}=await client().auth.signInWithPassword({email:account.user.email,password:input.password});
 if(loginError||!data.session||data.user.id!==profile.id) return invalid();
 return reply(200,tokens(data.session));
});
