"""Browser integration fixtures only: no requests reach the live authentication service."""
import base64,json,time,re
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
BASE='http://127.0.0.1:5182'
def b64(v):return base64.urlsafe_b64encode(json.dumps(v).encode()).decode().rstrip('=')
def run(browser,role):
 context=browser.new_context();page=context.new_page();page.set_default_timeout(12000)
 state={'role':role,'pending':role in ['student','teacher'],'requests':[],'errors':[]}
 def profile(r):return {'id':r+'-id','email':r+'@example.test','role':r,'full_name':'Test '+r.title(),'is_active':True,'username':'MIS'+r.upper(),'password_change_token':'pending' if r==role and state['pending'] else None}
 def user():return {'id':role+'-id','email':role+'@example.test','aud':'authenticated','role':'authenticated','app_metadata':{},'user_metadata':{}}
 def session():return {'access_token':b64({'alg':'HS256'})+'.'+b64({'sub':role+'-id','exp':int(time.time())+3600,'role':'authenticated'})+'.test','refresh_token':'fixture-refresh','token_type':'bearer','expires_in':3600,'user':user()}
 def route(r):
  path=urlparse(r.request.url).path
  if urlparse(r.request.url).hostname in ['127.0.0.1','localhost']:return r.continue_()
  state['requests'].append(path)
  result=[]
  if '/auth/v1/' in path:
   if path.endswith('/user'):result=user()
   elif path.endswith('/logout'):return r.fulfill(status=204)
   else:result=session()
  elif '/functions/v1/' in path:
   if path.endswith('/portal-login'):result=session()
   elif path.endswith('/change-portal-password'):state['pending']=False;result=session()
   else:
    body=r.request.post_data_json
    target=body.get('role','student')
    result={'id':target+'-id','fullName':'Created '+target,'role':target,'username':'MIS'+target.upper(),'temporaryPassword':'FixtureTemp123!'}
  elif '/rest/v1/' in path:
   table=path.split('/')[-1];single='vnd.pgrst.object' in r.request.headers.get('accept','')
   if table=='profiles':result=profile(role)
   elif table=='classes':result=[{'id':'class-id','grade_level':'Grade 8','division':'A','academic_year':'2026-2027'}]
   elif table=='subjects':result=[{'id':'math-id','code':'MATH','name':'Mathematics'}]
   elif table=='students':result=[{'id':'student-record','user_id':'student-id','student_id':'S001','class_id':'class-id','roll_number':1,'profiles':profile('student'),'classes':{'id':'class-id','grade_level':'Grade 8','division':'A','academic_year':'2026-2027'}}]
   elif table=='teachers':result=[{'id':'teacher-record','user_id':'teacher-id','employee_id':'T001','profiles':profile('teacher'),'teacher_class_assignments':[]}]
   if single and isinstance(result,list):result=result[0] if result else None
  else:return r.abort()
  r.fulfill(status=200,content_type='application/json',body=json.dumps(result))
 context.route('**/*',route);page.on('pageerror',lambda e:state['errors'].append(str(e)))
 page.goto(BASE+'/portal/login')
 expect(page.locator('form input').first).to_be_visible()
 page.locator('form input').nth(0).fill('MIS'+role.upper() if role in ['student','teacher'] else role+'@example.test')
 page.locator('form input').nth(1).fill('FixtureTemp123!')
 page.get_by_role('button',name='Sign In to Portal').click()
 if state['pending']:
  page.wait_for_url('**/portal/change-password');expect(page.get_by_role('heading',name='Choose your password')).to_be_visible()
  assert '/functions/v1/portal-login' in state['requests']
  assert not any('/rest/v1/students' in p or '/rest/v1/teachers' in p for p in state['requests']), 'Pending account fetched portal data'
  page.goto(BASE+'/portal/'+role+'/dashboard');page.wait_for_url('**/portal/change-password')
  page.reload();expect(page.get_by_role('heading',name='Choose your password')).to_be_visible()
  page.get_by_label('Temporary password',exact=True).fill('FixtureTemp123!');page.get_by_label('New password',exact=True).fill('NewFixturePassword123!');page.get_by_label('Confirm new password',exact=True).fill('NewFixturePassword123!');page.get_by_role('button',name='Save password').click()
 page.wait_for_url('**/portal/'+role+'/dashboard');expect(page.get_by_role('button',name='Sign Out',exact=True)).to_be_visible()
 page.reload();expect(page.get_by_role('button',name='Sign Out',exact=True)).to_be_visible()
 assert 'Supabase' not in page.locator('body').inner_text()
 if role=='admin':
  for target in ['student','teacher']:
   page.goto(BASE+'/portal/admin/'+target+'s')
   page.get_by_role('button',name='Add '+target.title(),exact=True).click()
   form=page.locator('form');form.locator('input').nth(0).fill('New '+target);form.locator('input').nth(1).fill('new-'+target+'@example.test')
   form.get_by_label('Class',exact=True).select_option('Grade 8');form.get_by_label('Division',exact=True).select_option('class-id')
   if target=='teacher':form.get_by_label('Subject',exact=True).select_option('math-id')
   if target=='student':form.locator('input[type=number]').fill('1')
   form.locator('button[type=submit]').click()
   dialog=page.get_by_role('dialog',name='Account credentials');expect(dialog).to_be_visible();expect(dialog).to_contain_text('MIS'+target.upper());expect(dialog).to_contain_text('FixtureTemp123!')
   dialog.get_by_role('button',name='Close',exact=True).click();expect(dialog).not_to_be_visible()
   page.once('dialog',lambda d:d.accept());page.get_by_role('button',name='Reset Password',exact=True).first.click();expect(dialog).to_be_visible();expect(dialog).to_contain_text('Password Reset Successfully');dialog.get_by_role('button',name='Close',exact=True).click()
 elif role in ['student','teacher']:
  page.goto(BASE+'/portal/admin/dashboard');expect(page.get_by_role('heading',name='Access Denied')).to_be_visible();page.goto(BASE+'/portal/'+role+'/dashboard')
 page.get_by_role('button',name='Sign Out',exact=True).click();page.wait_for_url('**/portal/login')
 page.goto(BASE+'/portal/'+role+'/dashboard');page.wait_for_url('**/portal/login')
 page.goto(BASE+'/portal');expect(page.get_by_text('Parent Portal',exact=True)).to_have_count(0);assert 'Supabase' not in page.locator('body').inner_text()
 page.goto(BASE+'/portal/parent/dashboard');expect(page.get_by_text('Parent Portal Dashboard',exact=True)).to_have_count(0)
 assert not state['errors'],state['errors']
 context.close();print('PASS',role,'login, dashboard, refresh, logout, route guards, school-friendly UI'+('; create/reset student and teacher' if role=='admin' else '; forced password change' if role in ['student','teacher'] else ''))
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chromium',headless=True)
 try:
  for role in ['admin','principal','student','teacher']:run(browser,role)
 finally:browser.close()
