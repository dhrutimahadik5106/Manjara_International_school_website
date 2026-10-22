-- Compared with the connected project on 2026-09-27. No existing records are removed.
begin;
alter table public.holidays add column if not exists category text;
alter table public.holidays add column if not exists source_kind text not null default 'SCHOOL';
alter table public.holidays add column if not exists source_url text;
alter table public.holidays add column if not exists source_key text;
update public.holidays set category=case type::text when 'public' then 'PUBLIC_HOLIDAY' when 'national' then 'PUBLIC_HOLIDAY' when 'festival' then 'PUBLIC_HOLIDAY' when 'vacation' then 'VACATION' when 'exam_break' then 'EXAM_BREAK' when 'special' then 'SPECIAL_DAY' else 'SCHOOL_HOLIDAY' end where category is null;
alter table public.holidays alter column category set not null;
alter table public.holidays alter column category set default 'SCHOOL_HOLIDAY';
alter table public.holidays add constraint holidays_category_valid check(category in ('PUBLIC_HOLIDAY','SCHOOL_HOLIDAY','VACATION','EXAM_BREAK','SPECIAL_DAY'));
alter table public.holidays add constraint holidays_source_valid check(source_kind in ('SCHOOL','GOVERNMENT_REFERENCE'));
alter table public.holidays add constraint holidays_dates_valid check(end_date is null or end_date>=start_date) not valid;
create unique index if not exists holidays_source_key_unique on public.holidays(source_key) where source_key is not null;
create unique index if not exists classes_catalog_unique on public.classes(lower(btrim(grade_level)),lower(btrim(division)),academic_year);
-- Reference dates only. This does NOT declare school closure or invent vacations.
-- Source: Maharashtra GAD notification PHD-1125/C.R.199/Japuk (29), 5 December 2025,
-- Part A (24 public holidays), English pages 3-4 (PDF pages 5-6):
-- https://maharashtra.gov.in/site/Upload/pdf/Public-Holiday-2026.pdf
-- Excludes bank-only 1 April and government-office-only Bhaubeej 11 November.
with seed(title,day) as (values
 ('Republic Day',date '2026-01-26'),
 ('Mahashivratri',date '2026-02-15'),
 ('Chhatrapati Shivaji Maharaj Jayanti',date '2026-02-19'),
 ('Holi (Second Day)',date '2026-03-03'),
 ('Gudhi Padwa',date '2026-03-19'),
 ('Ramzan-Id (Id-Ul-Fitra)',date '2026-03-21'),
 ('Ram Navami',date '2026-03-26'),
 ('Mahavir Janmakalyanak',date '2026-03-31'),
 ('Good Friday',date '2026-04-03'),
 ('Dr. Babasaheb Ambedkar Jayanti',date '2026-04-14'),
 ('Maharashtra Day',date '2026-05-01'),
 ('Buddha Pournima',date '2026-05-01'),
 ('Bakri Id (Id-Uz-Zuha)',date '2026-05-28'),
 ('Moharum',date '2026-06-26'),
 ('Independence Day',date '2026-08-15'),
 ('Parsi New Year (Shahenshahi)',date '2026-08-15'),
 ('Id-E-Milad',date '2026-08-26'),
 ('Ganesh Chaturthi',date '2026-09-14'),
 ('Mahatma Gandhi Jayanti',date '2026-10-02'),
 ('Dasara',date '2026-10-20'),
 ('Diwali Amavasya (Laxmi Pujan)',date '2026-11-08'),
 ('Diwali (Bali Pratipada)',date '2026-11-10'),
 ('Guru Nanak Jayanti',date '2026-11-24'),
 ('Christmas',date '2026-12-25')
)
insert into public.holidays(title,start_date,end_date,type,category,academic_year,description,applicable_to,is_active,source_kind,source_url,source_key)
select s.title,s.day,s.day,'public','PUBLIC_HOLIDAY',case when s.day<date '2026-04-01' then '2025-2026' else '2026-2027' end,
'Government public holiday reference; school closure is subject to the school circular.',array['student','teacher','principal','admin']::public.user_role[],true,
'GOVERNMENT_REFERENCE','https://maharashtra.gov.in/site/Upload/pdf/Public-Holiday-2026.pdf','MH-2026-'||s.day::text||'-'||lower(s.title)
from seed s where not exists(select 1 from public.holidays h where lower(h.title)=lower(s.title) and h.start_date=s.day)
on conflict (source_key) where source_key is not null do nothing;
-- Preserve the original notification record. School-specific dates are separate rows.
create or replace function portal_private.protect_reference_holiday() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
 if current_user in ('anon','authenticated') then
  if TG_OP='INSERT' then
   if new.source_kind<>'SCHOOL' or new.source_key is not null or new.source_url is not null then raise exception 'Reference holidays are server-managed'; end if;
  else
   if old.source_kind='GOVERNMENT_REFERENCE' then raise exception 'Reference holidays are read only'; end if;
   if TG_OP='UPDATE' and row(new.source_kind,new.source_key,new.source_url) is distinct from row(old.source_kind,old.source_key,old.source_url) then raise exception 'Holiday source is server-managed'; end if;
  end if;
 end if;
 if TG_OP='DELETE' then return old; end if;return new;
end $$;
revoke all on function portal_private.protect_reference_holiday() from public,anon,authenticated;
create trigger portal_reference_holiday_guard before insert or update or delete on public.holidays for each row execute function portal_private.protect_reference_holiday();
commit;
