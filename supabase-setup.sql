-- ══════════════════════════════════════════════════════════════
--  OUR LITTLE SPACE - SUPABASE SETUP
--  Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ══════════════════════════════════════════════════════════════

-- STEP 1: Create profiles table (maps email to role)
create table if not exists profiles (
  email text primary key,
  role text not null check (role in ('him', 'her')),
  name text not null,
  emoji text not null
);

-- STEP 2: Create todos table
create table if not exists todos (
  id text primary key,
  text text not null,
  description text default '',
  cat text default 'general',
  priority text default 'medium',
  status text default 'pending',
  added_by text not null,
  assign_to text default 'both',
  him_done boolean default false,
  her_done boolean default false,
  due_date text default '',
  created_at bigint not null,
  updated_at bigint not null
);

-- STEP 3: Create notes table
create table if not exists notes (
  id text primary key,
  text text not null,
  from_role text not null,
  from_name text not null,
  type text default 'note',
  ts bigint not null
);

-- STEP 4: Create redeems table
create table if not exists redeems (
  id text primary key,
  message text not null,
  phone text default '',
  status text default 'pending',
  ts bigint not null,
  responded_at bigint
);

-- STEP 5: Enable Row Level Security
alter table profiles enable row level security;
alter table todos enable row level security;
alter table notes enable row level security;
alter table redeems enable row level security;

-- STEP 6: RLS Policies (private 2-person app - any authenticated user has full access)
create policy "auth_select_profiles" on profiles for select to authenticated using (true);

create policy "auth_select_todos" on todos for select to authenticated using (true);
create policy "auth_insert_todos" on todos for insert to authenticated with check (true);
create policy "auth_update_todos" on todos for update to authenticated using (true);
create policy "auth_delete_todos" on todos for delete to authenticated using (true);

create policy "auth_select_notes" on notes for select to authenticated using (true);
create policy "auth_insert_notes" on notes for insert to authenticated with check (true);
create policy "auth_update_notes" on notes for update to authenticated using (true);
create policy "auth_delete_notes" on notes for delete to authenticated using (true);

create policy "auth_select_redeems" on redeems for select to authenticated using (true);
create policy "auth_insert_redeems" on redeems for insert to authenticated with check (true);
create policy "auth_update_redeems" on redeems for update to authenticated using (true);
create policy "auth_delete_redeems" on redeems for delete to authenticated using (true);

-- STEP 7: Enable Realtime for live sync between both users
alter publication supabase_realtime add table todos;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table redeems;

-- ══════════════════════════════════════════════════════════════
--  STEP 8: INSERT YOUR PROFILES
--  ⚠️ REPLACE the emails below with your ACTUAL emails
--     (same emails you created in Authentication > Users)
-- ══════════════════════════════════════════════════════════════
insert into profiles (email, role, name, emoji) values
  ('sanjay125005@gmail.com', 'him', 'Sanjay', '⭐'),
  ('kiruthikaammu655@gmail.com', 'her', 'Kiruthika', '🌙');
