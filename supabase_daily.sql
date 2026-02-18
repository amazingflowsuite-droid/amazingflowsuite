-- Daily Members Table
create table public.daily_members (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  role text,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Daily History Table
create table public.daily_history (
  id uuid not null default gen_random_uuid() primary key,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  duration integer not null,
  team_size integer not null
);

-- Daily State Table (Singleton)
create table public.daily_state (
  id integer primary key default 1,
  status text check (status in ('idle', 'running', 'paused', 'finished')) default 'idle',
  active_member_id uuid references public.daily_members(id),
  queue jsonb default '[]'::jsonb,
  speaker_limit integer default 120,
  global_time_limit integer default 900,
  timebox_mode text check (timebox_mode in ('manual', 'auto')) default 'manual',
  
  -- Snapshots
  seconds_remaining integer default 120,
  global_seconds_remaining integer default 900,
  last_updated_at timestamp with time zone default now()
);

-- RLS
alter table public.daily_members enable row level security;
alter table public.daily_history enable row level security;
alter table public.daily_state enable row level security;

-- Policies (Public for MVP)
create policy "Public members access" on public.daily_members for all using (true) with check (true);
create policy "Public history access" on public.daily_history for all using (true) with check (true);
create policy "Public state access" on public.daily_state for all using (true) with check (true);

-- Seed Initial State
insert into public.daily_state (id) values (1) on conflict (id) do nothing;

-- Seed Initial Members (Optional, migration from hardcoded)
insert into public.daily_members (name, role, avatar) values 
('John Doe', 'Frontend Dev', 'https://github.com/shadcn.png'),
('Sarah Smith', 'Backend Dev', 'https://ui-avatars.com/api/?name=Sarah+Smith&background=random'),
('Mike Johnson', 'QA Engineer', 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random');
