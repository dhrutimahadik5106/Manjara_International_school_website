"""Local UI fixtures. Does not send traffic to the connected school database."""
import base64,json,time
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
BASE='http://127.0.0.1:5182'
def b64(x):return base64.urlsafe_b64encode(json.dumps(x).encode()).decode().rstrip('=')
store={'notices':[],'events':[],'holidays':[{'id':'public','title':'Republic Day','start_date':'2026-01-26','end_date':'2026-01-26','type':'public','category':'PUBLIC_HOLIDAY','source_kind':'GOVERNMENT_REFERENCE','source_url':'https://maharashtra.gov.in/site/Upload/pdf/Public-Holiday-2026.pdf','academic_year':'2025-2026','is_active':True,'applicable_to':['student','teacher','principal']},{'id':'christmas','title':'Christmas','start_date':'2026-12-25','end_date':'2026-12-25','type':'public','category':'PUBLIC_HOLIDAY','source_kind':'GOVERNMENT_REFERENCE','academic_year':'2026-2027','is_active':True,'applicable_to':['student','teacher','principal']}]}
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chromium',headless=True)
 try:
  for role in ['admin','student','teacher','principal']:
   context=browser.new_context();page=context.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   user={'id':role+'-id','email':role+'@example.test','aud':'authenticated','role':'authenticated'}
   session={'access_token':b64({'alg':'HS256'})+'.'+b64({'sub':user['id'],'exp':int(time.time())+3600})+'.test','refresh_token':'fixture','expires_in':3600,'token_type':'bearer','user':user}
   def route(r):
    url=urlparse(r.request.url)
    if url.hostname in ['localhost','127.0.0.1']:return r.continue_()
    if '/auth/v1/' in url.path:return r.fulfill(status=200,content_type='application/json',body=json.dumps(user if url.path.endswith('/user') else session))
    if '/functions/v1/portal-login' in url.path:return r.fulfill(status=200,content_type='application/json',body=json.dumps(session))
    if '/rest/v1/' not in url.path:return r.abort()
    table=url.path.split('/')[-1];args=parse_qs(url.query);single='vnd.pgrst.object' in r.request.headers.get('accept','');rows=[]
    if table=='profiles':rows={'id':user['id'],'role':role,'email':user['email'],'full_name':'Test '+role,'is_active':True,'username':'MIS'+role.upper(),'password_change_token':None}
    elif table in store:
     if r.request.method=='POST':
      row=r.request.post_data_json;row.update({'id':table+str(len(store[table])),'created_at':'2026-09-27T12:00:00Z'});store[table].append(row);rows=[row]
     elif r.request.method=='PATCH':
      target=args.get('id',[''])[0].removeprefix('eq.');rows=[x for x in store[table] if x['id']==target]
      for x in rows:x.update(r.request.post_data_json)
     else:
      rows=[x for x in store[table] if role=='admin' or role in x.get('target_roles',x.get('applicable_to',[]))]
      if 'is_active' in args:rows=[x for x in rows if x.get('is_active')]
      if table=='events' and 'event_date' in args:rows=[x for x in rows if x['event_date']>=args['event_date'][0].removeprefix('gte.')]
    elif table=='teachers':rows=[{'id':'teacher','user_id':user['id'],'employee_id':'T1','profiles':{'full_name':'Test teacher'},'teacher_class_assignments':[]}]
    if single and isinstance(rows,list):rows=rows[0] if rows else None
    r.fulfill(status=200,content_type='application/json',body=json.dumps(rows))
   context.route('**/*',route)
   page.goto(BASE+'/portal/login');page.locator('form input').nth(0).fill(role+'@example.test' if role in ['admin','principal'] else 'MIS'+role.upper());page.locator('form input').nth(1).fill('FixturePassword123!');page.get_by_role('button',name='Sign In to Portal').click();page.wait_for_url('**/'+role+'/dashboard')
   if role=='admin':
    page.goto(BASE+'/portal/admin/notices');page.get_by_role('button',name='Add Announcement',exact=True).click();form=page.locator('form');form.locator('input[type=text]').fill('School-wide notice');form.locator('textarea').fill('Shared circular');form.get_by_role('button',name='Publish Circular').click();expect(page.get_by_role('heading',name='School-wide notice')).to_be_visible();assert store['notices'][0]['target_roles']==['student','teacher','principal']
    page.goto(BASE+'/portal/admin/events');page.get_by_role('button',name='Add Event',exact=True).click();page.get_by_label('Title',exact=True).fill('School-wide event');page.get_by_label('Date',exact=True).fill('2026-10-20');page.get_by_role('button',name='Publish Event').click();expect(page.get_by_role('cell',name='School-wide event',exact=True)).to_be_visible();assert store['events'][0]['target_roles']==['student','teacher','principal']
   else:
    expect(page.get_by_text('School-wide notice',exact=True).first).to_be_visible();expect(page.get_by_text('School-wide event',exact=True).first).to_be_visible()
    page.goto(BASE+'/portal/'+role+'/notices');expect(page.get_by_role('heading',name='School-wide notice',exact=True)).to_be_visible()
    page.goto(BASE+'/portal/'+role+'/events');expect(page.get_by_role('cell',name='School-wide event',exact=True)).to_be_visible();expect(page.get_by_role('button',name='Add Event',exact=True)).to_have_count(0)
   page.goto(BASE+'/portal/'+role+'/calendar');page.get_by_label('Calendar Year',exact=True).fill('2026');page.get_by_role('button',name='View year',exact=True).click();expect(page.get_by_role('button').filter(has_text='Republic Day').first).to_be_visible();expect(page.get_by_role('button').filter(has_text='Christmas').first).to_be_visible()
   page.get_by_role('button').filter(has_text='Republic Day').first.click();expect(page.get_by_text('Government public holiday reference.',exact=False)).to_be_visible();expect(page.get_by_role('button',name='Edit school holiday')).to_have_count(0)
   page.get_by_label('Holiday category filter').select_option('VACATION');expect(page.get_by_text('No holidays in this year.',exact=True)).to_be_visible()
   if role=='admin':
    page.get_by_role('button',name='Add Holiday',exact=True).click();form=page.locator('form');form.locator('input').nth(0).fill('School closure');form.locator('input[type=date]').nth(0).fill('2026-12-30');form.locator('input[type=date]').nth(1).fill('2026-12-30');form.locator('select').select_option('SCHOOL_HOLIDAY');form.get_by_role('button',name='Confirm & Publish Holiday').click();expect(form).not_to_be_visible();assert store['holidays'][-1]['category']=='SCHOOL_HOLIDAY'
    page.get_by_label('Holiday category filter').select_option('SCHOOL_HOLIDAY');page.get_by_role('button').filter(has_text='School closure').first.click();page.once('dialog',lambda d:d.accept());page.get_by_role('button',name='Deactivate school holiday').click();expect(page.get_by_text('No holidays in this year.',exact=True)).to_be_visible();assert store['holidays'][-1]['is_active']==False
   assert not errors,errors;context.close();print('PASS',role,'shared notices/events and year/category calendar'+('; Admin publishing and holiday deactivation' if role=='admin' else ''))
 finally:browser.close()
