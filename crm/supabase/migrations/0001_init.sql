-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Profiles table (one per Auth user)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'trainer' check (role in ('admin','trainer')),
  created_at timestamptz not null default now()
);

-- Students table
create table public.alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  plano text,
  valor_mensalidade numeric(10,2),
  data_inicio date not null default current_date,
  ativo boolean not null default true,
  trainer_id uuid references public.profiles(id),
  observacoes text,
  created_at timestamptz not null default now()
);

-- Training history table
create table public.historico_treino (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  trainer_id uuid references public.profiles(id),
  data_sessao date not null default current_date,
  observacoes text,
  created_at timestamptz not null default now()
);

-- Payments table
create table public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  competencia date not null,
  valor numeric(10,2) not null,
  status text not null default 'pendente' check (status in ('pendente','pago','atrasado')),
  data_vencimento date not null,
  data_pagamento date,
  created_at timestamptz not null default now()
);

-- Attendance table
create table public.frequencia (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  data_checkin date not null default current_date,
  hora_checkin time not null default current_time,
  created_at timestamptz not null default now()
);

-- Create indexes
create index idx_historico_treino_aluno on public.historico_treino(aluno_id);
create index idx_pagamentos_aluno on public.pagamentos(aluno_id);
create index idx_frequencia_aluno on public.frequencia(aluno_id);
create index idx_alunos_ativo on public.alunos(ativo);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.alunos enable row level security;
alter table public.historico_treino enable row level security;
alter table public.pagamentos enable row level security;
alter table public.frequencia enable row level security;

-- RLS Policies (v1 original, superseded by 0002_tighten_rls.sql)
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_insert_all" on public.profiles
  for insert with check (true);

create policy "profiles_update_all" on public.profiles
  for update using (true) with check (true);

create policy "alunos_select_all" on public.alunos
  for select using (true);

create policy "alunos_insert_all" on public.alunos
  for insert with check (true);

create policy "alunos_update_all" on public.alunos
  for update using (true) with check (true);

create policy "alunos_delete_all" on public.alunos
  for delete using (true);

create policy "historico_treino_select_all" on public.historico_treino
  for select using (true);

create policy "historico_treino_insert_all" on public.historico_treino
  for insert with check (true);

create policy "historico_treino_update_all" on public.historico_treino
  for update using (true) with check (true);

create policy "historico_treino_delete_all" on public.historico_treino
  for delete using (true);

create policy "pagamentos_select_all" on public.pagamentos
  for select using (true);

create policy "pagamentos_insert_all" on public.pagamentos
  for insert with check (true);

create policy "pagamentos_update_all" on public.pagamentos
  for update using (true) with check (true);

create policy "pagamentos_delete_all" on public.pagamentos
  for delete using (true);

create policy "frequencia_select_all" on public.frequencia
  for select using (true);

create policy "frequencia_insert_all" on public.frequencia
  for insert with check (true);

create policy "frequencia_update_all" on public.frequencia
  for update using (true) with check (true);

create policy "frequencia_delete_all" on public.frequencia
  for delete using (true);

-- Function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on auth user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
