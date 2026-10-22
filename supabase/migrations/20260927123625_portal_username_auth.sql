-- Additive migration. No Auth password internals or parent records are changed.
-- Review live ownership RLS using inspect-portal.sql BEFORE applying this migration.
begin;
create schema if not exists portal_private;
revoke all on schema portal_private from public, anon;
grant usage on schema portal_private to authenticated, service_role;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists password_change_token uuid;
create unique index if not exists profiles_username_unique on public.profiles (upper(username)) where username is not null;
create sequence if not exists portal_private.username_sequence;
grant usage on sequence portal_private.username_sequence to service_role;
create or replace function portal_private.protect_profile() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if current_user in ('anon','authenticated') then
  if TG_OP = 'INSERT' then raise exception 'Accounts must be created by an administrator'; end if;
  if row(new.id,new.role,new.email,new.username,new.is_active,new.password_change_token)
     is distinct from row(old.id,old.role,old.email,old.username,old.is_active,old.password_change_token)
  then raise exception 'Account security fields are server-managed'; end if;
 elsif new.role::text in ('student','teacher') and new.username is null then
  new.username := case when new.role::text='student' then 'MISSTU' else 'MISTCH' end
      || lpad(nextval('portal_private.username_sequence')::text,10,'0');
 end if;
 return new;
end $$;
revoke all on function portal_private.protect_profile() from public,anon,authenticated;
create trigger portal_protect_profile before insert or update on public.profiles
for each row execute function portal_private.protect_profile();
-- Existing accounts retain their passwords; usernames are assigned automatically.
update public.profiles set username=null where username is null and role::text in ('student','teacher');
-- Reads only the caller's own profile. Private SECURITY DEFINER avoids profiles-policy recursion.
create or replace function portal_private.portal_ready() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles p where p.id=(select auth.uid())
   and p.is_active and p.role::text in ('admin','principal','student','teacher')
   and p.password_change_token is null);
$$;
revoke all on function portal_private.portal_ready() from public,anon;
grant execute on function portal_private.portal_ready() to authenticated;
-- RESTRICTIVE gates intersect existing ownership policies; they never grant access.
-- Live inspection confirmed RLS is enabled on every table. Missing permissive policies
-- remain default-deny until the reviewed portal_ownership_rls migration is installed.
do $$
declare t text;
begin
 foreach t in array array['profiles','classes','subjects','students','parents','parent_student_links','teachers','teacher_class_assignments',
 'attendance','assignments','assignment_submissions','results','timetable','notices','events','study_materials','fees','audit_logs','holidays'] loop
  if to_regclass('public.'||t) is null then raise exception 'Missing expected table: %',t; end if;
  if not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
     where n.nspname='public' and c.relname=t and c.relrowsecurity)
  then raise exception 'Review and configure ownership RLS for public.% before applying authentication migration',t; end if;
  if t='profiles' then
   execute 'create policy portal_password_gate on public.profiles as restrictive for all to authenticated using (id=(select auth.uid()) or (select portal_private.portal_ready())) with check (id=(select auth.uid()) or (select portal_private.portal_ready()))';
  else
   execute format('create policy portal_password_gate on public.%I as restrictive for all to authenticated using ((select portal_private.portal_ready())) with check ((select portal_private.portal_ready()))',t);
  end if;
 end loop;
end $$;
-- Serialize reset/change across Edge Function instances. No passwords are stored here.
create table portal_private.password_operations (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 operation_id uuid not null,
 started_at timestamptz not null default now()
);
alter table portal_private.password_operations enable row level security;
revoke all on portal_private.password_operations from public, anon, authenticated;
grant select,insert,delete on portal_private.password_operations to service_role;
create function public.begin_portal_password_operation(account_id uuid, operation_id uuid)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 insert into portal_private.password_operations(user_id,operation_id) values(account_id,operation_id) on conflict do nothing;
 return found;
end $$;
create function public.end_portal_password_operation(account_id uuid, operation_id uuid)
returns void language sql security invoker set search_path='' as $$
 delete from portal_private.password_operations p where p.user_id=account_id and p.operation_id=$2;
$$;
revoke all on function public.begin_portal_password_operation(uuid,uuid), public.end_portal_password_operation(uuid,uuid) from public,anon,authenticated;
grant execute on function public.begin_portal_password_operation(uuid,uuid), public.end_portal_password_operation(uuid,uuid) to service_role;
commit;
