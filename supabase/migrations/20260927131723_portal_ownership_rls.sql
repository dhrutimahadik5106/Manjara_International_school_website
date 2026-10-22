-- Requires portal_username_auth and portal_catalog_calendar. Additive policies, no data deletion.
begin;
create or replace function portal_private.school_role() returns text language sql stable security definer set search_path='' as $$
 select p.role::text from public.profiles p where p.id=(select auth.uid()) and p.is_active and p.password_change_token is null and p.role::text in ('admin','principal','student','teacher');
$$;
create or replace function portal_private.school_teaches(c uuid,s uuid default null) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and portal_private.school_role()='teacher' and exists(select 1 from public.teachers t join public.teacher_class_assignments a on a.teacher_id=t.id where t.user_id=(select auth.uid()) and a.class_id=c and (s is null or a.subject_id=s));
$$;
create or replace function portal_private.school_class(c uuid) returns boolean language sql stable security definer set search_path='' as $$
 select coalesce((select auth.uid()) is not null and (portal_private.school_role() in ('admin','principal') or portal_private.school_teaches(c) or (portal_private.school_role()='student' and exists(select 1 from public.students s where s.user_id=(select auth.uid()) and s.class_id=c))),false);
$$;
create or replace function portal_private.school_student(s uuid) returns boolean language sql stable security definer set search_path='' as $$
 select coalesce((select auth.uid()) is not null and (portal_private.school_role() in ('admin','principal') or exists(select 1 from public.students st where st.id=s and ((portal_private.school_role()='student' and st.user_id=(select auth.uid())) or portal_private.school_teaches(st.class_id)))),false);
$$;
create or replace function portal_private.school_teacher(t uuid) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from public.teachers th where th.id=t and (portal_private.school_role() in ('admin','principal') or (portal_private.school_role()='teacher' and th.user_id=(select auth.uid())) or (portal_private.school_role()='student' and exists(select 1 from public.teacher_class_assignments a where a.teacher_id=t and portal_private.school_class(a.class_id)))));
$$;
create or replace function portal_private.school_profile(p uuid) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and (p=(select auth.uid()) or portal_private.school_role() in ('admin','principal') or exists(select 1 from public.students s where s.user_id=p and portal_private.school_student(s.id)) or exists(select 1 from public.teachers t where t.user_id=p and portal_private.school_teacher(t.id)));
$$;
create or replace function portal_private.school_owns_teacher(t uuid) returns boolean language sql stable security definer set search_path='' as $$
 select portal_private.school_role()='teacher' and exists(select 1 from public.teachers x where x.id=t and x.user_id=(select auth.uid()));
$$;
create or replace function portal_private.school_student_class(s uuid,c uuid) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from public.students x where x.id=s and x.class_id=c and portal_private.school_student(x.id));
$$;
create or replace function portal_private.school_result(s uuid,subject uuid) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from public.students x where x.id=s and portal_private.school_teaches(x.class_id,subject));
$$;
create or replace function portal_private.school_submission(a uuid,s uuid,writing boolean default false) returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from public.assignments x join public.students st on st.class_id=x.class_id where x.id=a and st.id=s and (portal_private.school_role()='admin' or (not writing and portal_private.school_role()='principal') or (portal_private.school_role()='student' and st.user_id=(select auth.uid())) or portal_private.school_teaches(x.class_id,x.subject_id)));
$$;
revoke all on function portal_private.school_role() from public,anon;
grant execute on function portal_private.school_role() to authenticated;
revoke all on function portal_private.school_teaches(uuid,uuid) from public,anon;
grant execute on function portal_private.school_teaches(uuid,uuid) to authenticated;
revoke all on function portal_private.school_class(uuid) from public,anon;
grant execute on function portal_private.school_class(uuid) to authenticated;
revoke all on function portal_private.school_student(uuid) from public,anon;
grant execute on function portal_private.school_student(uuid) to authenticated;
revoke all on function portal_private.school_teacher(uuid) from public,anon;
grant execute on function portal_private.school_teacher(uuid) to authenticated;
revoke all on function portal_private.school_profile(uuid) from public,anon;
grant execute on function portal_private.school_profile(uuid) to authenticated;
revoke all on function portal_private.school_owns_teacher(uuid) from public,anon;
grant execute on function portal_private.school_owns_teacher(uuid) to authenticated;
revoke all on function portal_private.school_student_class(uuid,uuid) from public,anon;
grant execute on function portal_private.school_student_class(uuid,uuid) to authenticated;
revoke all on function portal_private.school_result(uuid,uuid) from public,anon;
grant execute on function portal_private.school_result(uuid,uuid) to authenticated;
revoke all on function portal_private.school_submission(uuid,uuid,boolean) from public,anon;
grant execute on function portal_private.school_submission(uuid,uuid,boolean) to authenticated;

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select,insert,update,delete on public.profiles to authenticated;
create policy school_select_permissive on public.profiles as permissive for select to authenticated using (portal_private.school_profile(id));
create policy school_insert_permissive on public.profiles as permissive for insert to authenticated  with check (false);
create policy school_update_permissive on public.profiles as permissive for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy school_delete_permissive on public.profiles as permissive for delete to authenticated using (false);
create policy school_select_restrictive on public.profiles as restrictive for select to authenticated using (portal_private.school_profile(id));
create policy school_insert_restrictive on public.profiles as restrictive for insert to authenticated  with check (false);
create policy school_update_restrictive on public.profiles as restrictive for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy school_delete_restrictive on public.profiles as restrictive for delete to authenticated using (false);

alter table public.students enable row level security;
revoke all on public.students from anon;
grant select,insert,update,delete on public.students to authenticated;
create policy school_select_permissive on public.students as permissive for select to authenticated using (portal_private.school_student(id));
create policy school_insert_permissive on public.students as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.students as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.students as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.students as restrictive for select to authenticated using (portal_private.school_student(id));
create policy school_insert_restrictive on public.students as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.students as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.students as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.parents enable row level security;
revoke all on public.parents from anon;
grant select,insert,update,delete on public.parents to authenticated;
create policy school_select_permissive on public.parents as permissive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal'));
create policy school_insert_permissive on public.parents as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.parents as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.parents as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.parents as restrictive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal'));
create policy school_insert_restrictive on public.parents as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.parents as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.parents as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.parent_student_links enable row level security;
revoke all on public.parent_student_links from anon;
grant select,insert,update,delete on public.parent_student_links to authenticated;
create policy school_select_permissive on public.parent_student_links as permissive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal'));
create policy school_insert_permissive on public.parent_student_links as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.parent_student_links as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.parent_student_links as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.parent_student_links as restrictive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal'));
create policy school_insert_restrictive on public.parent_student_links as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.parent_student_links as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.parent_student_links as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.classes enable row level security;
revoke all on public.classes from anon;
grant select,insert,update,delete on public.classes to authenticated;
create policy school_select_permissive on public.classes as permissive for select to authenticated using (portal_private.school_class(id));
create policy school_insert_permissive on public.classes as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.classes as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.classes as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.classes as restrictive for select to authenticated using (portal_private.school_class(id));
create policy school_insert_restrictive on public.classes as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.classes as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.classes as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.subjects enable row level security;
revoke all on public.subjects from anon;
grant select,insert,update,delete on public.subjects to authenticated;
create policy school_select_permissive on public.subjects as permissive for select to authenticated using ((select portal_private.school_role()) is not null);
create policy school_insert_permissive on public.subjects as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.subjects as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.subjects as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.subjects as restrictive for select to authenticated using ((select portal_private.school_role()) is not null);
create policy school_insert_restrictive on public.subjects as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.subjects as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.subjects as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.teachers enable row level security;
revoke all on public.teachers from anon;
grant select,insert,update,delete on public.teachers to authenticated;
create policy school_select_permissive on public.teachers as permissive for select to authenticated using (portal_private.school_teacher(id));
create policy school_insert_permissive on public.teachers as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.teachers as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.teachers as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.teachers as restrictive for select to authenticated using (portal_private.school_teacher(id));
create policy school_insert_restrictive on public.teachers as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.teachers as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.teachers as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.teacher_class_assignments enable row level security;
revoke all on public.teacher_class_assignments from anon;
grant select,insert,update,delete on public.teacher_class_assignments to authenticated;
create policy school_select_permissive on public.teacher_class_assignments as permissive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal') or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_class(class_id)) or ((select portal_private.school_role())='student' and portal_private.school_class(class_id)));
create policy school_insert_permissive on public.teacher_class_assignments as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.teacher_class_assignments as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.teacher_class_assignments as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.teacher_class_assignments as restrictive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal') or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_class(class_id)) or ((select portal_private.school_role())='student' and portal_private.school_class(class_id)));
create policy school_insert_restrictive on public.teacher_class_assignments as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.teacher_class_assignments as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.teacher_class_assignments as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.attendance enable row level security;
revoke all on public.attendance from anon;
grant select,insert,update,delete on public.attendance to authenticated;
create policy school_select_permissive on public.attendance as permissive for select to authenticated using (portal_private.school_student(student_id));
create policy school_insert_permissive on public.attendance as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin' or (portal_private.school_teaches(class_id) and portal_private.school_student_class(student_id,class_id) and marked_by=(select auth.uid())));
create policy school_update_permissive on public.attendance as permissive for update to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_teaches(class_id) and portal_private.school_student_class(student_id,class_id) and marked_by=(select auth.uid()))) with check ((select portal_private.school_role())='admin' or (portal_private.school_teaches(class_id) and portal_private.school_student_class(student_id,class_id) and marked_by=(select auth.uid())));
create policy school_delete_permissive on public.attendance as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.attendance as restrictive for select to authenticated using (portal_private.school_student(student_id));
create policy school_insert_restrictive on public.attendance as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin' or (portal_private.school_teaches(class_id) and portal_private.school_student_class(student_id,class_id) and marked_by=(select auth.uid())));
create policy school_update_restrictive on public.attendance as restrictive for update to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_teaches(class_id) and portal_private.school_student_class(student_id,class_id) and marked_by=(select auth.uid()))) with check ((select portal_private.school_role())='admin' or (portal_private.school_teaches(class_id) and portal_private.school_student_class(student_id,class_id) and marked_by=(select auth.uid())));
create policy school_delete_restrictive on public.attendance as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.assignments enable row level security;
revoke all on public.assignments from anon;
grant select,insert,update,delete on public.assignments to authenticated;
create policy school_select_permissive on public.assignments as permissive for select to authenticated using (portal_private.school_class(class_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_teaches(class_id,subject_id)));
create policy school_insert_permissive on public.assignments as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_update_permissive on public.assignments as permissive for update to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id))) with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_delete_permissive on public.assignments as permissive for delete to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_select_restrictive on public.assignments as restrictive for select to authenticated using (portal_private.school_class(class_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_teaches(class_id,subject_id)));
create policy school_insert_restrictive on public.assignments as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_update_restrictive on public.assignments as restrictive for update to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id))) with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_delete_restrictive on public.assignments as restrictive for delete to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));

alter table public.assignment_submissions enable row level security;
revoke all on public.assignment_submissions from anon;
grant select,insert,update,delete on public.assignment_submissions to authenticated;
create policy school_select_permissive on public.assignment_submissions as permissive for select to authenticated using (portal_private.school_submission(assignment_id,student_id));
create policy school_insert_permissive on public.assignment_submissions as permissive for insert to authenticated  with check (portal_private.school_submission(assignment_id,student_id,true));
create policy school_update_permissive on public.assignment_submissions as permissive for update to authenticated using (portal_private.school_submission(assignment_id,student_id,true)) with check (portal_private.school_submission(assignment_id,student_id,true));
create policy school_delete_permissive on public.assignment_submissions as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.assignment_submissions as restrictive for select to authenticated using (portal_private.school_submission(assignment_id,student_id));
create policy school_insert_restrictive on public.assignment_submissions as restrictive for insert to authenticated  with check (portal_private.school_submission(assignment_id,student_id,true));
create policy school_update_restrictive on public.assignment_submissions as restrictive for update to authenticated using (portal_private.school_submission(assignment_id,student_id,true)) with check (portal_private.school_submission(assignment_id,student_id,true));
create policy school_delete_restrictive on public.assignment_submissions as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.results enable row level security;
revoke all on public.results from anon;
grant select,insert,update,delete on public.results to authenticated;
create policy school_select_permissive on public.results as permissive for select to authenticated using (portal_private.school_student(student_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_result(student_id,subject_id)));
create policy school_insert_permissive on public.results as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin' or portal_private.school_result(student_id,subject_id));
create policy school_update_permissive on public.results as permissive for update to authenticated using ((select portal_private.school_role())='admin' or portal_private.school_result(student_id,subject_id)) with check ((select portal_private.school_role())='admin' or portal_private.school_result(student_id,subject_id));
create policy school_delete_permissive on public.results as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.results as restrictive for select to authenticated using (portal_private.school_student(student_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_result(student_id,subject_id)));
create policy school_insert_restrictive on public.results as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin' or portal_private.school_result(student_id,subject_id));
create policy school_update_restrictive on public.results as restrictive for update to authenticated using ((select portal_private.school_role())='admin' or portal_private.school_result(student_id,subject_id)) with check ((select portal_private.school_role())='admin' or portal_private.school_result(student_id,subject_id));
create policy school_delete_restrictive on public.results as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.timetable enable row level security;
revoke all on public.timetable from anon;
grant select,insert,update,delete on public.timetable to authenticated;
create policy school_select_permissive on public.timetable as permissive for select to authenticated using (portal_private.school_class(class_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_teaches(class_id,subject_id)));
create policy school_insert_permissive on public.timetable as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.timetable as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.timetable as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.timetable as restrictive for select to authenticated using (portal_private.school_class(class_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_teaches(class_id,subject_id)));
create policy school_insert_restrictive on public.timetable as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.timetable as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.timetable as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.study_materials enable row level security;
revoke all on public.study_materials from anon;
grant select,insert,update,delete on public.study_materials to authenticated;
create policy school_select_permissive on public.study_materials as permissive for select to authenticated using (portal_private.school_class(class_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_teaches(class_id,subject_id)));
create policy school_insert_permissive on public.study_materials as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_update_permissive on public.study_materials as permissive for update to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id))) with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_delete_permissive on public.study_materials as permissive for delete to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_select_restrictive on public.study_materials as restrictive for select to authenticated using (portal_private.school_class(class_id) and ((select portal_private.school_role())<>'teacher' or portal_private.school_teaches(class_id,subject_id)));
create policy school_insert_restrictive on public.study_materials as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_update_restrictive on public.study_materials as restrictive for update to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id))) with check ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));
create policy school_delete_restrictive on public.study_materials as restrictive for delete to authenticated using ((select portal_private.school_role())='admin' or (portal_private.school_owns_teacher(teacher_id) and portal_private.school_teaches(class_id,subject_id)));

alter table public.fees enable row level security;
revoke all on public.fees from anon;
grant select,insert,update,delete on public.fees to authenticated;
create policy school_select_permissive on public.fees as permissive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal') or ((select portal_private.school_role())='student' and portal_private.school_student(student_id)));
create policy school_insert_permissive on public.fees as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_permissive on public.fees as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.fees as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.fees as restrictive for select to authenticated using ((select portal_private.school_role()) in ('admin','principal') or ((select portal_private.school_role())='student' and portal_private.school_student(student_id)));
create policy school_insert_restrictive on public.fees as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin');
create policy school_update_restrictive on public.fees as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.fees as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.notices enable row level security;
revoke all on public.notices from anon;
grant select,insert,update,delete on public.notices to authenticated;
create policy school_select_permissive on public.notices as permissive for select to authenticated using ((select portal_private.school_role())='admin' or (select portal_private.school_role())=any(target_roles::text[]));
create policy school_insert_permissive on public.notices as permissive for insert to authenticated  with check ((select portal_private.school_role()) in ('admin','principal') and published_by=(select auth.uid()) and cardinality(target_roles)>0 and target_roles::text[] <@ array['student','teacher','principal','admin']);
create policy school_update_permissive on public.notices as permissive for update to authenticated using ((select portal_private.school_role())='admin' or ((select portal_private.school_role())='principal' and published_by=(select auth.uid()))) with check ((select portal_private.school_role())='admin' or ((select portal_private.school_role())='principal' and published_by=(select auth.uid())));
create policy school_delete_permissive on public.notices as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.notices as restrictive for select to authenticated using ((select portal_private.school_role())='admin' or (select portal_private.school_role())=any(target_roles::text[]));
create policy school_insert_restrictive on public.notices as restrictive for insert to authenticated  with check ((select portal_private.school_role()) in ('admin','principal') and published_by=(select auth.uid()) and cardinality(target_roles)>0 and target_roles::text[] <@ array['student','teacher','principal','admin']);
create policy school_update_restrictive on public.notices as restrictive for update to authenticated using ((select portal_private.school_role())='admin' or ((select portal_private.school_role())='principal' and published_by=(select auth.uid()))) with check ((select portal_private.school_role())='admin' or ((select portal_private.school_role())='principal' and published_by=(select auth.uid())));
create policy school_delete_restrictive on public.notices as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.events enable row level security;
revoke all on public.events from anon;
grant select,insert,update,delete on public.events to authenticated;
create policy school_select_permissive on public.events as permissive for select to authenticated using ((select portal_private.school_role())='admin' or (select portal_private.school_role())=any(target_roles::text[]));
create policy school_insert_permissive on public.events as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin' and cardinality(target_roles)>0 and target_roles::text[] <@ array['student','teacher','principal','admin']);
create policy school_update_permissive on public.events as permissive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_permissive on public.events as permissive for delete to authenticated using ((select portal_private.school_role())='admin');
create policy school_select_restrictive on public.events as restrictive for select to authenticated using ((select portal_private.school_role())='admin' or (select portal_private.school_role())=any(target_roles::text[]));
create policy school_insert_restrictive on public.events as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin' and cardinality(target_roles)>0 and target_roles::text[] <@ array['student','teacher','principal','admin']);
create policy school_update_restrictive on public.events as restrictive for update to authenticated using ((select portal_private.school_role())='admin') with check ((select portal_private.school_role())='admin');
create policy school_delete_restrictive on public.events as restrictive for delete to authenticated using ((select portal_private.school_role())='admin');

alter table public.holidays enable row level security;
revoke all on public.holidays from anon;
grant select,insert,update,delete on public.holidays to authenticated;
create policy school_select_permissive on public.holidays as permissive for select to authenticated using ((select portal_private.school_role())='admin' or (is_active and (select portal_private.school_role())=any(applicable_to::text[])));
create policy school_insert_permissive on public.holidays as permissive for insert to authenticated  with check ((select portal_private.school_role())='admin' and source_kind='SCHOOL');
create policy school_update_permissive on public.holidays as permissive for update to authenticated using ((select portal_private.school_role())='admin' and source_kind='SCHOOL') with check ((select portal_private.school_role())='admin' and source_kind='SCHOOL');
create policy school_delete_permissive on public.holidays as permissive for delete to authenticated using ((select portal_private.school_role())='admin' and source_kind='SCHOOL');
create policy school_select_restrictive on public.holidays as restrictive for select to authenticated using ((select portal_private.school_role())='admin' or (is_active and (select portal_private.school_role())=any(applicable_to::text[])));
create policy school_insert_restrictive on public.holidays as restrictive for insert to authenticated  with check ((select portal_private.school_role())='admin' and source_kind='SCHOOL');
create policy school_update_restrictive on public.holidays as restrictive for update to authenticated using ((select portal_private.school_role())='admin' and source_kind='SCHOOL') with check ((select portal_private.school_role())='admin' and source_kind='SCHOOL');
create policy school_delete_restrictive on public.holidays as restrictive for delete to authenticated using ((select portal_private.school_role())='admin' and source_kind='SCHOOL');

alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from anon;
grant select,insert,update,delete on public.audit_logs to authenticated;
create policy school_select_permissive on public.audit_logs as permissive for select to authenticated using ((select portal_private.school_role())='admin');
create policy school_insert_permissive on public.audit_logs as permissive for insert to authenticated  with check (false);
create policy school_update_permissive on public.audit_logs as permissive for update to authenticated using (false) with check (false);
create policy school_delete_permissive on public.audit_logs as permissive for delete to authenticated using (false);
create policy school_select_restrictive on public.audit_logs as restrictive for select to authenticated using ((select portal_private.school_role())='admin');
create policy school_insert_restrictive on public.audit_logs as restrictive for insert to authenticated  with check (false);
create policy school_update_restrictive on public.audit_logs as restrictive for update to authenticated using (false) with check (false);
create policy school_delete_restrictive on public.audit_logs as restrictive for delete to authenticated using (false);

-- Keep students from editing their own assessment fields through submission updates.
create or replace function portal_private.protect_submission_grade() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if current_user='authenticated' and portal_private.school_role()='student' then
  if new.grade is not null or new.feedback is not null or new.status::text not in ('pending','submitted','late') then raise exception 'Assessment fields are teacher-managed'; end if;
  if TG_OP='UPDATE' and row(new.student_id,new.assignment_id) is distinct from row(old.student_id,old.assignment_id) then raise exception 'Submission ownership cannot change'; end if;
 end if;
 return new;
end $$;
revoke all on function portal_private.protect_submission_grade() from public,anon,authenticated;
create trigger school_submission_grade_guard before insert or update on public.assignment_submissions for each row execute function portal_private.protect_submission_grade();
create index if not exists students_class_scope on public.students(class_id);
create index if not exists teacher_assignments_class_scope on public.teacher_class_assignments(class_id,subject_id);
create index if not exists attendance_student_scope on public.attendance(student_id);
create index if not exists results_student_scope on public.results(student_id);
commit;
