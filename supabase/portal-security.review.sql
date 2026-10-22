-- REVIEW ONLY. Not applied. Compare inspect-portal.sql with the live project first.
-- Uses existing tables in supabase_schema.sql. No tables/data/policies are dropped.
-- Do not expose portal_private through the Data API.
begin;
create schema if not exists portal_private;
revoke all on schema portal_private from public;
grant usage on schema portal_private to authenticated;
create or replace function portal_private.current_role() returns text
language sql stable security definer set search_path = '' as $$
 select role::text from public.profiles where id=(select auth.uid()) and is_active is true
$$;
create or replace function portal_private.can_student(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select coalesce(portal_private.current_role() in ('admin','principal') or exists(select 1 from public.students s where s.id=target and (
 (portal_private.current_role()='student' and s.user_id=(select auth.uid())) or
 (portal_private.current_role()='parent' and exists(select 1 from public.parents p join public.parent_student_links l on l.parent_id=p.id where p.user_id=(select auth.uid()) and l.student_id=s.id)) or
 (portal_private.current_role()='teacher' and exists(select 1 from public.teachers t join public.teacher_class_assignments a on a.teacher_id=t.id where t.user_id=(select auth.uid()) and a.class_id=s.class_id))
 )),false)
$$;
create or replace function portal_private.teaches(target_class uuid,target_subject uuid default null) returns boolean
language sql stable security definer set search_path = '' as $$
 select coalesce(portal_private.current_role()='teacher' and exists(select 1 from public.teachers t join public.teacher_class_assignments a on a.teacher_id=t.id where t.user_id=(select auth.uid()) and a.class_id=target_class and (target_subject is null or a.subject_id=target_subject)),false)
$$;
create or replace function portal_private.can_class(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select coalesce(portal_private.current_role() in ('admin','principal') or portal_private.teaches(target) or exists(select 1 from public.students s where s.class_id=target and portal_private.can_student(s.id)),false)
$$;
create or replace function portal_private.owns_teacher(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select coalesce(portal_private.current_role()='teacher' and exists(select 1 from public.teachers where id=target and user_id=(select auth.uid())),false)
$$;
create or replace function portal_private.can_profile(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select coalesce(portal_private.current_role() is not null and (target=(select auth.uid()) or portal_private.current_role() in ('admin','principal') or exists(select 1 from public.students s where s.user_id=target and portal_private.can_student(s.id)) or exists(select 1 from public.teachers t join public.teacher_class_assignments a on a.teacher_id=t.id where t.user_id=target and portal_private.can_class(a.class_id))),false)
$$;
create or replace function portal_private.can_submission(assignment uuid,student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.assignments a join public.students s on s.class_id=a.class_id where a.id=assignment and s.id=student and portal_private.can_student(s.id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(a.class_id,a.subject_id)))
$$;
create or replace function portal_private.student_submission(assignment uuid,student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select portal_private.current_role()='student' and exists(select 1 from public.students s join public.assignments a on a.class_id=s.class_id where s.user_id=(select auth.uid()) and s.id=student and a.id=assignment)
$$;
revoke all on all functions in schema portal_private from public;
grant execute on all functions in schema portal_private to authenticated;

-- profiles
alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select on public.profiles to authenticated;
create policy mis_portal_select_cap on public.profiles as restrictive for select to authenticated using (portal_private.can_profile(id));
create policy mis_portal_select on public.profiles as permissive for select to authenticated using (portal_private.can_profile(id));
create policy mis_portal_insert_cap on public.profiles as restrictive for insert to authenticated with check (id=(select auth.uid()) and portal_private.current_role() is not null);
create policy mis_portal_insert on public.profiles as permissive for insert to authenticated with check (id=(select auth.uid()) and portal_private.current_role() is not null);
create policy mis_portal_update_cap on public.profiles as restrictive for update to authenticated using (id=(select auth.uid()) and portal_private.current_role() is not null) with check (id=(select auth.uid()) and portal_private.current_role() is not null);
create policy mis_portal_update on public.profiles as permissive for update to authenticated using (id=(select auth.uid()) and portal_private.current_role() is not null) with check (id=(select auth.uid()) and portal_private.current_role() is not null);
create policy mis_portal_delete_cap on public.profiles as restrictive for delete to authenticated using (id=(select auth.uid()) and portal_private.current_role() is not null);
create policy mis_portal_delete on public.profiles as permissive for delete to authenticated using (id=(select auth.uid()) and portal_private.current_role() is not null);

-- students
alter table public.students enable row level security;
revoke all on public.students from anon;
grant select on public.students to authenticated;
grant insert,update,delete on public.students to authenticated;
create policy mis_portal_select_cap on public.students as restrictive for select to authenticated using (portal_private.can_student(id));
create policy mis_portal_select on public.students as permissive for select to authenticated using (portal_private.can_student(id));
create policy mis_portal_insert_cap on public.students as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.students as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.students as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.students as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.students as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.students as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- parents
alter table public.parents enable row level security;
revoke all on public.parents from anon;
grant select on public.parents to authenticated;
grant insert,update,delete on public.parents to authenticated;
create policy mis_portal_select_cap on public.parents as restrictive for select to authenticated using (portal_private.current_role() in ('admin','principal') or (user_id=(select auth.uid()) and portal_private.current_role()='parent'));
create policy mis_portal_select on public.parents as permissive for select to authenticated using (portal_private.current_role() in ('admin','principal') or (user_id=(select auth.uid()) and portal_private.current_role()='parent'));
create policy mis_portal_insert_cap on public.parents as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.parents as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.parents as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.parents as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.parents as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.parents as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- parent_student_links
alter table public.parent_student_links enable row level security;
revoke all on public.parent_student_links from anon;
grant select on public.parent_student_links to authenticated;
grant insert,update,delete on public.parent_student_links to authenticated;
create policy mis_portal_select_cap on public.parent_student_links as restrictive for select to authenticated using (portal_private.current_role() in ('admin','principal') or (portal_private.current_role() in ('parent','student') and portal_private.can_student(student_id)));
create policy mis_portal_select on public.parent_student_links as permissive for select to authenticated using (portal_private.current_role() in ('admin','principal') or (portal_private.current_role() in ('parent','student') and portal_private.can_student(student_id)));
create policy mis_portal_insert_cap on public.parent_student_links as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.parent_student_links as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.parent_student_links as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.parent_student_links as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.parent_student_links as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.parent_student_links as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- classes
alter table public.classes enable row level security;
revoke all on public.classes from anon;
grant select on public.classes to authenticated;
grant insert,update,delete on public.classes to authenticated;
create policy mis_portal_select_cap on public.classes as restrictive for select to authenticated using (portal_private.can_class(id));
create policy mis_portal_select on public.classes as permissive for select to authenticated using (portal_private.can_class(id));
create policy mis_portal_insert_cap on public.classes as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.classes as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.classes as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.classes as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.classes as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.classes as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- subjects
alter table public.subjects enable row level security;
revoke all on public.subjects from anon;
grant select on public.subjects to authenticated;
grant insert,update,delete on public.subjects to authenticated;
create policy mis_portal_select_cap on public.subjects as restrictive for select to authenticated using (portal_private.current_role() is not null);
create policy mis_portal_select on public.subjects as permissive for select to authenticated using (portal_private.current_role() is not null);
create policy mis_portal_insert_cap on public.subjects as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.subjects as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.subjects as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.subjects as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.subjects as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.subjects as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- teachers
alter table public.teachers enable row level security;
revoke all on public.teachers from anon;
grant select on public.teachers to authenticated;
grant insert,update,delete on public.teachers to authenticated;
create policy mis_portal_select_cap on public.teachers as restrictive for select to authenticated using (portal_private.current_role() in ('admin','principal') or portal_private.can_profile(user_id));
create policy mis_portal_select on public.teachers as permissive for select to authenticated using (portal_private.current_role() in ('admin','principal') or portal_private.can_profile(user_id));
create policy mis_portal_insert_cap on public.teachers as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.teachers as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.teachers as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.teachers as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.teachers as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.teachers as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- teacher_class_assignments
alter table public.teacher_class_assignments enable row level security;
revoke all on public.teacher_class_assignments from anon;
grant select on public.teacher_class_assignments to authenticated;
grant insert,update,delete on public.teacher_class_assignments to authenticated;
create policy mis_portal_select_cap on public.teacher_class_assignments as restrictive for select to authenticated using (portal_private.current_role() in ('admin','principal') or portal_private.owns_teacher(teacher_id));
create policy mis_portal_select on public.teacher_class_assignments as permissive for select to authenticated using (portal_private.current_role() in ('admin','principal') or portal_private.owns_teacher(teacher_id));
create policy mis_portal_insert_cap on public.teacher_class_assignments as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.teacher_class_assignments as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.teacher_class_assignments as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.teacher_class_assignments as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.teacher_class_assignments as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.teacher_class_assignments as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- attendance
alter table public.attendance enable row level security;
revoke all on public.attendance from anon;
grant select on public.attendance to authenticated;
grant insert,update,delete on public.attendance to authenticated;
create policy mis_portal_select_cap on public.attendance as restrictive for select to authenticated using (portal_private.can_student(student_id));
create policy mis_portal_select on public.attendance as permissive for select to authenticated using (portal_private.can_student(student_id));
create policy mis_portal_insert_cap on public.attendance as restrictive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id)));
create policy mis_portal_insert on public.attendance as permissive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id)));
create policy mis_portal_update_cap on public.attendance as restrictive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id))) with check (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id)));
create policy mis_portal_update on public.attendance as permissive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id))) with check (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id)));
create policy mis_portal_delete_cap on public.attendance as restrictive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id)));
create policy mis_portal_delete on public.attendance as permissive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.teaches(class_id) and marked_by=(select auth.uid()) and exists(select 1 from public.students s where s.id=student_id and s.class_id=attendance.class_id)));

-- assignments
alter table public.assignments enable row level security;
revoke all on public.assignments from anon;
grant select on public.assignments to authenticated;
grant insert,update,delete on public.assignments to authenticated;
create policy mis_portal_select_cap on public.assignments as restrictive for select to authenticated using (portal_private.can_class(class_id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(class_id,subject_id)));
create policy mis_portal_select on public.assignments as permissive for select to authenticated using (portal_private.can_class(class_id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(class_id,subject_id)));
create policy mis_portal_insert_cap on public.assignments as restrictive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_insert on public.assignments as permissive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_update_cap on public.assignments as restrictive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id))) with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_update on public.assignments as permissive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id))) with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_delete_cap on public.assignments as restrictive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_delete on public.assignments as permissive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));

-- assignment_submissions
alter table public.assignment_submissions enable row level security;
revoke all on public.assignment_submissions from anon;
grant select on public.assignment_submissions to authenticated;
grant insert,update,delete on public.assignment_submissions to authenticated;
create policy mis_portal_select_cap on public.assignment_submissions as restrictive for select to authenticated using (portal_private.can_submission(assignment_id,student_id));
create policy mis_portal_select on public.assignment_submissions as permissive for select to authenticated using (portal_private.can_submission(assignment_id,student_id));
create policy mis_portal_insert_cap on public.assignment_submissions as restrictive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null));
create policy mis_portal_insert on public.assignment_submissions as permissive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null));
create policy mis_portal_update_cap on public.assignment_submissions as restrictive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null)) with check (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null));
create policy mis_portal_update on public.assignment_submissions as permissive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null)) with check (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null));
create policy mis_portal_delete_cap on public.assignment_submissions as restrictive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null));
create policy mis_portal_delete on public.assignment_submissions as permissive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.current_role()='teacher' and portal_private.can_submission(assignment_id,student_id)) or (portal_private.student_submission(assignment_id,student_id) and status in ('submitted','late') and grade is null and feedback is null));

-- results
alter table public.results enable row level security;
revoke all on public.results from anon;
grant select on public.results to authenticated;
grant insert,update,delete on public.results to authenticated;
create policy mis_portal_select_cap on public.results as restrictive for select to authenticated using (portal_private.can_student(student_id) and (portal_private.current_role()<>'teacher' or exists(select 1 from public.students s where s.id=student_id and portal_private.teaches(s.class_id,subject_id))));
create policy mis_portal_select on public.results as permissive for select to authenticated using (portal_private.can_student(student_id) and (portal_private.current_role()<>'teacher' or exists(select 1 from public.students s where s.id=student_id and portal_private.teaches(s.class_id,subject_id))));
create policy mis_portal_insert_cap on public.results as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.results as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.results as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.results as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.results as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.results as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- timetable
alter table public.timetable enable row level security;
revoke all on public.timetable from anon;
grant select on public.timetable to authenticated;
grant insert,update,delete on public.timetable to authenticated;
create policy mis_portal_select_cap on public.timetable as restrictive for select to authenticated using (portal_private.can_class(class_id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(class_id,subject_id)));
create policy mis_portal_select on public.timetable as permissive for select to authenticated using (portal_private.can_class(class_id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(class_id,subject_id)));
create policy mis_portal_insert_cap on public.timetable as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.timetable as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.timetable as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.timetable as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.timetable as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.timetable as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- study_materials
alter table public.study_materials enable row level security;
revoke all on public.study_materials from anon;
grant select on public.study_materials to authenticated;
grant insert,update,delete on public.study_materials to authenticated;
create policy mis_portal_select_cap on public.study_materials as restrictive for select to authenticated using (portal_private.can_class(class_id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(class_id,subject_id)));
create policy mis_portal_select on public.study_materials as permissive for select to authenticated using (portal_private.can_class(class_id) and (portal_private.current_role()<>'teacher' or portal_private.teaches(class_id,subject_id)));
create policy mis_portal_insert_cap on public.study_materials as restrictive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_insert on public.study_materials as permissive for insert to authenticated with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_update_cap on public.study_materials as restrictive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id))) with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_update on public.study_materials as permissive for update to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id))) with check (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_delete_cap on public.study_materials as restrictive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));
create policy mis_portal_delete on public.study_materials as permissive for delete to authenticated using (portal_private.current_role()='admin' or (portal_private.owns_teacher(teacher_id) and portal_private.teaches(class_id,subject_id)));

-- fees
alter table public.fees enable row level security;
revoke all on public.fees from anon;
grant select on public.fees to authenticated;
grant insert,update,delete on public.fees to authenticated;
create policy mis_portal_select_cap on public.fees as restrictive for select to authenticated using (portal_private.current_role() in ('admin','principal') or (portal_private.current_role() in ('student','parent') and portal_private.can_student(student_id)));
create policy mis_portal_select on public.fees as permissive for select to authenticated using (portal_private.current_role() in ('admin','principal') or (portal_private.current_role() in ('student','parent') and portal_private.can_student(student_id)));
create policy mis_portal_insert_cap on public.fees as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.fees as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.fees as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.fees as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.fees as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.fees as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- notices
alter table public.notices enable row level security;
revoke all on public.notices from anon;
grant select on public.notices to authenticated;
grant insert,update,delete on public.notices to authenticated;
create policy mis_portal_select_cap on public.notices as restrictive for select to authenticated using (portal_private.current_role()=any(target_roles::text[]));
create policy mis_portal_select on public.notices as permissive for select to authenticated using (portal_private.current_role()=any(target_roles::text[]));
create policy mis_portal_insert_cap on public.notices as restrictive for insert to authenticated with check (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid()));
create policy mis_portal_insert on public.notices as permissive for insert to authenticated with check (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid()));
create policy mis_portal_update_cap on public.notices as restrictive for update to authenticated using (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid())) with check (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid()));
create policy mis_portal_update on public.notices as permissive for update to authenticated using (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid())) with check (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid()));
create policy mis_portal_delete_cap on public.notices as restrictive for delete to authenticated using (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid()));
create policy mis_portal_delete on public.notices as permissive for delete to authenticated using (portal_private.current_role() in ('admin','principal') and published_by=(select auth.uid()));

-- events
alter table public.events enable row level security;
revoke all on public.events from anon;
grant select on public.events to authenticated;
grant insert,update,delete on public.events to authenticated;
create policy mis_portal_select_cap on public.events as restrictive for select to authenticated using (portal_private.current_role()=any(target_roles::text[]));
create policy mis_portal_select on public.events as permissive for select to authenticated using (portal_private.current_role()=any(target_roles::text[]));
create policy mis_portal_insert_cap on public.events as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.events as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.events as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.events as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.events as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.events as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- holidays
alter table public.holidays enable row level security;
revoke all on public.holidays from anon;
grant select on public.holidays to authenticated;
grant insert,update,delete on public.holidays to authenticated;
create policy mis_portal_select_cap on public.holidays as restrictive for select to authenticated using (portal_private.current_role()='admin' or (is_active and portal_private.current_role()=any(applicable_to::text[])));
create policy mis_portal_select on public.holidays as permissive for select to authenticated using (portal_private.current_role()='admin' or (is_active and portal_private.current_role()=any(applicable_to::text[])));
create policy mis_portal_insert_cap on public.holidays as restrictive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_insert on public.holidays as permissive for insert to authenticated with check (portal_private.current_role()='admin');
create policy mis_portal_update_cap on public.holidays as restrictive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_update on public.holidays as permissive for update to authenticated using (portal_private.current_role()='admin') with check (portal_private.current_role()='admin');
create policy mis_portal_delete_cap on public.holidays as restrictive for delete to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_delete on public.holidays as permissive for delete to authenticated using (portal_private.current_role()='admin');

-- audit_logs
alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from anon;
grant select on public.audit_logs to authenticated;
create policy mis_portal_select_cap on public.audit_logs as restrictive for select to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_select on public.audit_logs as permissive for select to authenticated using (portal_private.current_role()='admin');
create policy mis_portal_insert_cap on public.audit_logs as restrictive for insert to authenticated with check (false);
create policy mis_portal_insert on public.audit_logs as permissive for insert to authenticated with check (false);
create policy mis_portal_update_cap on public.audit_logs as restrictive for update to authenticated using (false) with check (false);
create policy mis_portal_update on public.audit_logs as permissive for update to authenticated using (false) with check (false);
create policy mis_portal_delete_cap on public.audit_logs as restrictive for delete to authenticated using (false);
create policy mis_portal_delete on public.audit_logs as permissive for delete to authenticated using (false);

-- Prevent a self-update policy from allowing self-promotion or account reactivation.
revoke insert,update,delete on public.profiles from authenticated;
grant update(full_name,phone_number,avatar_url) on public.profiles to authenticated;
-- Inspect existing column grants too: revoke any prior role/is_active column grants.
revoke update(role,is_active,email,id) on public.profiles from authenticated;
-- Storage policies depend on the actual existing buckets. None are invented here.
commit;
