const {test}=require('node:test');
const assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
const vm=require('node:vm');
const crypto=require('node:crypto').webcrypto;
const profiles=[{id:'admin',role:'admin',is_active:true,email:'admin@example.test'}, {id:'student',role:'student',is_active:true,email:'student@example.test',username:'MISSTU0000000001',password_change_token:'initial',full_name:'Student'}];
function fixture() {
 const state={profiles:structuredClone(profiles),accounts:{student:{id:'student',email:'student@example.test',password:'OldPassword123!'}},locks:new Map(),calls:[],students:[],teachers:[],failLink:false};
 const factory=(url,key)=>{
  let logged;
  const api={from(table){let action='read',body,filters=[],single=false;
   const q={select(){return q},eq(k,v){filters.push([k,v]);return q},single(){single=true;return q},maybeSingle(){single=true;return q},insert(v){action='insert';body=v;return q},upsert(v){action='upsert';body=v;return q},update(v){action='update';body=v;return q},then(resolve,reject){return Promise.resolve().then(()=>{
    state.calls.push({table,action,body});
    if(table==='classes'||table==='subjects')return {data:{id:table+'-id'},error:null};
    if(table==='teacher_class_assignments')return {data:[],error:null};
    const rows=state[table]||[];
    let found=rows.filter(row=>filters.every(([k,v])=>row[k]===v));
    if(action==='upsert'||action==='insert'){
     if(state.failLink&&table==='students')return {data:null,error:{code:'link'}};
     const row={...body};if(table==='profiles')row.username='MIS'+row.role.toUpperCase()+rows.length;else row.id='record-'+rows.length;
     rows.push(row);found=[row];
    } else if(action==='update')found.forEach(row=>Object.assign(row,body));
    return {data:single?(found[0]||null):found,error:null};
   }).then(resolve,reject)}};return q;},
   async rpc(name,args){if(name.startsWith('begin')){if(state.locks.has(args.account_id))return {data:false};state.locks.set(args.account_id,args.operation_id);return {data:true};}if(state.locks.get(args.account_id)===args.operation_id)state.locks.delete(args.account_id);return {data:null};},
   auth:{async getUser(token){return {data:{user:{id:token==='admin-token'?'admin':'student',email:token==='admin-token'?'admin@example.test':'student@example.test'}}};},
    async signInWithPassword({email,password}){logged=Object.values(state.accounts).find(a=>a.email===email&&a.password===password);return logged?{data:{user:logged,session:{access_token:'access',refresh_token:'refresh'}}}:{data:{},error:{code:'invalid'}};},
    async updateUser({password}){state.calls.push({auth:'self-update'});if(!logged)return {error:{}};logged.password=password;return {data:{user:logged}};},
    async getSession(){return {data:{session:{access_token:'access',refresh_token:'refresh'}}};},
    admin:{async getUserById(id){return {data:{user:state.accounts[id]}};},async updateUserById(id,{password}){state.calls.push({auth:'admin-update'});state.accounts[id].password=password;return {data:{user:state.accounts[id]}};},
     async createUser({email,password}){const id='new-'+Object.keys(state.accounts).length;state.accounts[id]={id,email,password};return {data:{user:{id,email}}};},
     async deleteUser(id){delete state.accounts[id];state.profiles=state.profiles.filter(p=>p.id!==id);return {error:null};}}
   }};return api;
 };
 function handler(name){let h;const code=buildSync({entryPoints:[`supabase/functions/${name}/index.ts`],bundle:true,write:false,platform:'node',format:'cjs',external:['npm:*']}).outputFiles[0].text;vm.runInNewContext(code,{exports:{},require:()=>({createClient:factory}),Deno:{env:{get:n=>n},serve:fn=>{h=fn}},Response,Request,crypto,console});return h;}
 const call=async(name,body,token='admin-token')=>{const r=await handler(name)(new Request('https://test.invalid',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body)}));return {status:r.status,body:await r.json()};};
 return {state,call};
}
test('username sign-in resolves one account and rejects email/password errors',async()=>{const {state,call}=fixture();assert.equal((await call('portal-login',{username:'misstu0000000001',password:'OldPassword123!'})).status,200);assert.equal((await call('portal-login',{username:'student@example.test',password:'OldPassword123!'})).status,401);assert.equal((await call('portal-login',{username:'MISSTU0000000001',password:'bad'})).status,401);assert.ok(state.calls.every(c=>c.table==='profiles'));});
test('inactive and parent roles cannot use username login',async()=>{for(const change of [{is_active:false},{role:'parent'}]){const {state,call}=fixture();Object.assign(state.profiles[1],change);assert.equal((await call('portal-login',{username:'MISSTU0000000001',password:'OldPassword123!'})).status,401);}});
test('admin creates linked student and teacher with one-time credentials',async()=>{for(const role of ['student','teacher']){const {state,call}=fixture();const r=await call('create-portal-user',{role,email:role+'2@example.test',fullName:'New Account',rollNumber:1,grade:'Grade 8',division:'A',assignedClasses:[{grade:'Grade 8',division:'A',subject:'Math'}]});assert.equal(r.status,201);assert.ok(r.body.username);assert.ok(r.body.temporaryPassword.length>=32);const profile=state.profiles.find(p=>p.id===r.body.id);assert.ok(profile.password_change_token);assert.equal(state[role==='student'?'students':'teachers'][0].user_id,r.body.id);assert.equal(JSON.stringify(state.profiles).includes(r.body.temporaryPassword),false);}});
test('non-admin create/reset is rejected',async()=>{const {state,call}=fixture();assert.equal((await call('reset-portal-password',{userId:'student'},'student-token')).status,403);assert.equal((await call('create-portal-user',{role:'student'},'student-token')).status,403);assert.equal(state.calls.some(c=>c.auth==='admin-update'),false);});
test('failed linkage removes only newly-created account',async()=>{const {state,call}=fixture();state.failLink=true;const r=await call('create-portal-user',{role:'student',email:'new@example.test',fullName:'New',rollNumber:1});assert.equal(r.status,500);assert.deepEqual(Object.keys(state.accounts),['student']);});
test('reset changes only target password, marks first login, releases lock',async()=>{const {state,call}=fixture();const r=await call('reset-portal-password',{userId:'student'});assert.equal(r.status,200);assert.notEqual(r.body.temporaryPassword,'OldPassword123!');assert.equal(state.accounts.student.password,r.body.temporaryPassword);assert.notEqual(state.profiles[1].password_change_token,'initial');assert.equal(state.locks.size,0);});
test('first-login change checks current password and clears marker only on success',async()=>{const {state,call}=fixture();assert.equal((await call('change-portal-password',{currentPassword:'wrong',newPassword:'NewSecurePassword123!'},'student-token')).status,401);assert.equal(state.profiles[1].password_change_token,'initial');const r=await call('change-portal-password',{currentPassword:'OldPassword123!',newPassword:'NewSecurePassword123!'},'student-token');assert.equal(r.status,200);assert.equal(state.profiles[1].password_change_token,null);assert.equal(state.accounts.student.password,'NewSecurePassword123!');assert.equal(state.locks.size,0);});
test('weak passwords and concurrent reset are rejected without password writes',async()=>{const {state,call}=fixture();assert.equal((await call('change-portal-password',{currentPassword:'OldPassword123!',newPassword:'short'},'student-token')).status,400);state.locks.set('student','other');assert.equal((await call('reset-portal-password',{userId:'student'})).status,409);assert.equal(state.calls.some(c=>c.auth),false);});
