-- Read-only inspection. Run against the intended project before reviewing policy changes.
select table_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' order by table_name, ordinal_position;
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check from pg_policies where schemaname in ('public', 'storage') order by tablename, policyname;
select c.relname, c.relrowsecurity, c.relforcerowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r';
select table_name, grantee, privilege_type from information_schema.role_table_grants where table_schema='public' and grantee in ('anon','authenticated') order by table_name, grantee;
select conrelid::regclass as table_name, conname, pg_get_constraintdef(oid) from pg_constraint where connamespace='public'::regnamespace order by conrelid::regclass::text, conname;
select event_object_table, trigger_name, action_statement from information_schema.triggers where event_object_schema in ('public','auth');
select id, name, public, file_size_limit, allowed_mime_types from storage.buckets;
