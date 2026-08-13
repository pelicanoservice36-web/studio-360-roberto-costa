-- Aperta as políticas de RLS: exige usuário autenticado via Supabase Auth
-- em vez de liberar acesso total pela anon key.
--
-- O app sempre opera com sessão logada (supabase.auth.signInWithPassword),
-- então isso não muda o comportamento do CRM — apenas bloqueia acesso
-- direto à API REST do Supabase por quem só tem a anon key (pública,
-- visível no bundle JS) mas nunca fez login.

-- profiles
drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_insert_all" on public.profiles;
drop policy if exists "profiles_update_all" on public.profiles;

create policy "profiles_select_authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_insert_authenticated" on public.profiles
  for insert with check (auth.role() = 'authenticated');

create policy "profiles_update_authenticated" on public.profiles
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- alunos
drop policy if exists "alunos_select_all" on public.alunos;
drop policy if exists "alunos_insert_all" on public.alunos;
drop policy if exists "alunos_update_all" on public.alunos;
drop policy if exists "alunos_delete_all" on public.alunos;

create policy "alunos_select_authenticated" on public.alunos
  for select using (auth.role() = 'authenticated');

create policy "alunos_insert_authenticated" on public.alunos
  for insert with check (auth.role() = 'authenticated');

create policy "alunos_update_authenticated" on public.alunos
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "alunos_delete_authenticated" on public.alunos
  for delete using (auth.role() = 'authenticated');

-- historico_treino
drop policy if exists "historico_treino_select_all" on public.historico_treino;
drop policy if exists "historico_treino_insert_all" on public.historico_treino;
drop policy if exists "historico_treino_update_all" on public.historico_treino;
drop policy if exists "historico_treino_delete_all" on public.historico_treino;

create policy "historico_treino_select_authenticated" on public.historico_treino
  for select using (auth.role() = 'authenticated');

create policy "historico_treino_insert_authenticated" on public.historico_treino
  for insert with check (auth.role() = 'authenticated');

create policy "historico_treino_update_authenticated" on public.historico_treino
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "historico_treino_delete_authenticated" on public.historico_treino
  for delete using (auth.role() = 'authenticated');

-- pagamentos
drop policy if exists "pagamentos_select_all" on public.pagamentos;
drop policy if exists "pagamentos_insert_all" on public.pagamentos;
drop policy if exists "pagamentos_update_all" on public.pagamentos;
drop policy if exists "pagamentos_delete_all" on public.pagamentos;

create policy "pagamentos_select_authenticated" on public.pagamentos
  for select using (auth.role() = 'authenticated');

create policy "pagamentos_insert_authenticated" on public.pagamentos
  for insert with check (auth.role() = 'authenticated');

create policy "pagamentos_update_authenticated" on public.pagamentos
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "pagamentos_delete_authenticated" on public.pagamentos
  for delete using (auth.role() = 'authenticated');

-- frequencia
drop policy if exists "frequencia_select_all" on public.frequencia;
drop policy if exists "frequencia_insert_all" on public.frequencia;
drop policy if exists "frequencia_update_all" on public.frequencia;
drop policy if exists "frequencia_delete_all" on public.frequencia;

create policy "frequencia_select_authenticated" on public.frequencia
  for select using (auth.role() = 'authenticated');

create policy "frequencia_insert_authenticated" on public.frequencia
  for insert with check (auth.role() = 'authenticated');

create policy "frequencia_update_authenticated" on public.frequencia
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "frequencia_delete_authenticated" on public.frequencia
  for delete using (auth.role() = 'authenticated');

-- Verificação final: lista as políticas ativas por tabela
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
