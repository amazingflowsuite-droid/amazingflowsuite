
-- Planning Module Migration

-- 1. Extend daily_members table
-- We use 'do' block to check if columns exist to avoid errors on re-runs
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'daily_members' and column_name = 'role_type') then
        alter table public.daily_members add column role_type text default 'Dev';
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'daily_members' and column_name = 'allocation') then
        alter table public.daily_members add column allocation integer default 100;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'daily_members' and column_name = 'days_off') then
        alter table public.daily_members add column days_off integer default 0;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'daily_members' and column_name = 'daily_hours') then
        alter table public.daily_members add column daily_hours integer default 8;
    end if;
end $$;

-- 2. Create Planning Settings Table (Singleton)
create table if not exists public.planning_settings (
    id integer primary key default 1,
    sprint_duration_days integer default 15,
    daily_scrum_duration float default 0.25, -- Stored as hours (15 mins = 0.25h)
    planning_duration float default 4,
    review_duration float default 2,
    retro_duration float default 2,
    refinement_duration float default 2,
    other_rituals_duration float default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed initial settings
insert into public.planning_settings (id) values (1) on conflict (id) do nothing;

-- 3. Create Planning Stories Table
create table if not exists public.planning_stories (
    id uuid not null default gen_random_uuid() primary key,
    title text not null,
    type text check (type in ('User Story', 'Bug', 'Task')) default 'User Story',
    points integer,
    in_sprint boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Planning Subtasks Table
create table if not exists public.planning_subtasks (
    id uuid not null default gen_random_uuid() primary key,
    story_id uuid references public.planning_stories(id) on delete cascade,
    title text not null,
    estimate float default 0,
    category text check (category in ('Implementation', 'Test')) default 'Implementation',
    completed boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.planning_settings enable row level security;
alter table public.planning_stories enable row level security;
alter table public.planning_subtasks enable row level security;

-- Create Policies (Public/Anon for MVP - aligned with daily_state)
create policy "Public settings access" on public.planning_settings for all using (true) with check (true);
create policy "Public stories access" on public.planning_stories for all using (true) with check (true);
create policy "Public subtasks access" on public.planning_subtasks for all using (true) with check (true);

-- Indexes for performance
create index if not exists idx_planning_subtasks_story_id on public.planning_subtasks(story_id);
create index if not exists idx_planning_stories_in_sprint on public.planning_stories(in_sprint);
