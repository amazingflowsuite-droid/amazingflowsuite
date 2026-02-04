-- Create Columns Table
create table public.kanban_columns (
  id text not null primary key,
  title text not null,
  phase text not null check (phase in ('pre-dev', 'dev', 'post-dev')),
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Tasks Table
create table public.kanban_tasks (
  id uuid not null default gen_random_uuid() primary key,
  content text not null,
  column_id text not null references public.kanban_columns(id),
  type text not null check (type in ('epic', 'feature', 'story', 'bug', 'block', 'impediment')),
  priority text check (priority in ('low', 'medium', 'high', 'critical')),
  parent_id uuid references public.kanban_tasks(id),
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.kanban_columns enable row level security;
alter table public.kanban_tasks enable row level security;

-- Create Policy to allow anonymous access for MVP (Update this for production!)
create policy "Allow public access to columns"
on public.kanban_columns
for all
using (true)
with check (true);

create policy "Allow public access to tasks"
on public.kanban_tasks
for all
using (true)
with check (true);

-- Seed Columns
insert into public.kanban_columns (id, title, phase, "order") values
('backlog', 'Backlog', 'pre-dev', 10),
('business_refinement', 'Business Refinement', 'pre-dev', 20),
('business_refinement_done', 'Business Refinement Done', 'pre-dev', 30),
('tech_refinement', 'Technical Refinement', 'pre-dev', 40),
('ready_dev', 'Ready for Dev', 'dev', 50),
('in_dev', 'In Development', 'dev', 60),
('developed', 'Developed', 'dev', 70),
('ready_qa', 'Ready for QA', 'dev', 80),
('in_qa', 'In QA Testing', 'dev', 90),
('qa_tested', 'QA Tested', 'post-dev', 100),
('ready_uat', 'Ready for UAT', 'post-dev', 110),
('ready_prod', 'Ready for Production', 'post-dev', 120),
('in_prod', 'In Production', 'post-dev', 130),
('validated_prod', 'Validated in Prod', 'post-dev', 140);
