# Studio 360 CRM

Sistema de gerenciamento de alunos para o Studio 360 (Personal Training), desenvolvido com React, Vite, TypeScript e Supabase.

## Features

- **Autenticação**: Login seguro via Supabase Auth
- **Cadastro de Alunos**: Registre nome, email, telefone, plano e valores
- **Histórico de Treino**: Acompanhe todas as sessões de treino e observações
- **Controle de Pagamentos**: Gerencie mensalidades, marque como pagas, acompanhe atrasos
- **Controle de Frequência**: Register check-ins de alunos com data e hora
- **Dashboard**: Resumo de alunos ativos e pagamentos pendentes

## Tecnologia

- **Frontend**: React 18 + Vite 5 + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Roteamento**: React Router DOM v6
- **Estilo**: CSS-in-JS com variáveis CSS e suporte a dark mode

## Setup Local

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Conta no Supabase (free tier é suficiente para desenvolvimento)

### Instalação

```bash
npm install
```

### Configuração de Environment

1. Crie um arquivo `.env` na raiz do projeto (copie `.env.example`)
2. Preencha com suas credenciais do Supabase:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=seu-anon-key-aqui
   ```

### Executar Localmente

```bash
npm run dev
```

Acesse em `http://localhost:5173/`

## Build para Produção

```bash
npm run build
```

Isso gera arquivos otimizados em `dist/`.

## Deploy no Cloudflare (Workers + Static Assets)

O CRM roda como um **Cloudflare Worker de assets estáticos**, separado do projeto `site/` (que tem seu próprio `wrangler.jsonc` na raiz do repo). Cada um é um projeto Cloudflare distinto, ambos conectados ao mesmo repositório GitHub.

- URL de produção: `https://studio-360-crm.pelicanoservice36.workers.dev`

### Configuração do projeto (dashboard Cloudflare → Workers & Pages)

No projeto `studio-360-crm` → **Settings** → **Build configuration**:

| Campo | Valor |
|---|---|
| Root directory | `crm` |
| Build command | `npm install && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Production branch | `main` |

### `crm/wrangler.jsonc`

```jsonc
{
  "name": "studio-360-crm",
  "compatibility_date": "2026-08-12",
  "assets": {
    "directory": "dist"
  }
}
```

Usa o formato `assets` (não o `site` legado de Workers Sites, que exige um worker script de entry-point). `assets.directory` aponta para o output do Vite (`dist/`).

### Variáveis de ambiente

Defina em **Settings** → **Variables and secrets** do projeto Cloudflare (não nos GitHub Secrets — o build roda direto na infraestrutura Cloudflare via Git integration, não via GitHub Actions):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Importante:** alterar essas variáveis só afeta builds futuros. Depois de adicioná-las/editá-las, é preciso disparar um novo deployment (push ou "Retry build") para o Vite embutir os valores no bundle.

### Deploy automático

Qualquer push em `main` que toque em `crm/**` dispara um novo build+deploy automaticamente (Git integration do Cloudflare).

## Estrutura do Projeto

```
crm/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout.tsx
│   │   ├── NavBar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/            # React Context (Auth)
│   │   └── AuthContext.tsx
│   ├── hooks/              # Hooks customizados (CRUD)
│   │   ├── useAlunos.ts
│   │   ├── useHistoricoTreino.ts
│   │   ├── usePagamentos.ts
│   │   └── useFrequencia.ts
│   ├── routes/             # Páginas
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── Alunos/
│   │       ├── AlunosList.tsx
│   │       ├── AlunoForm.tsx
│   │       └── AlunoDetail.tsx
│   ├── types/              # TypeScript types
│   │   └── database.ts
│   ├── lib/                # Utilitários
│   │   └── supabaseClient.ts
│   ├── App.tsx             # Router principal
│   ├── main.tsx            # Entrada React
│   └── index.css           # Estilos globais
├── supabase/
│   └── migrations/
│       └── 0001_init.sql   # Schema do banco de dados
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## Fluxo de Usuário

1. **Login**: Entre com email e senha (usuários criados no Supabase Auth)
2. **Dashboard**: Veja resumo de alunos e pagamentos
3. **Alunos**:
   - Lista: visualizar todos os alunos com busca
   - Novo: criar novo aluno
   - Detalhe: ver dados completos e gerenciar:
     - Histórico de treino
     - Pagamentos
     - Frequência (check-ins)

## Notas de Desenvolvimento

- **RLS (Row Level Security)**: Atualmente as políticas são permissivas (`USING (true)`) em todas as tabelas, liberando leitura/escrita mesmo via `anon key`. Isso foi necessário porque o app usa a anon key do Supabase (sem exigir `auth.role() = 'authenticated'`). É adequado para o MVP com poucos usuários confiáveis, mas **não é seguro para produção multi-tenant** — antes de abrir para mais professores, apertar as policies por `trainer_id`/`auth.uid()`.
- Todas as tabelas (`alunos`, `historico_treino`, `pagamentos`, `frequencia`) usam `id uuid primary key default gen_random_uuid()`. Não usar `bigint`/`serial` — isso já causou bug de "aluno não encontrado" (mismatch entre UUID da URL e ID numérico do banco) e exigiu recriar as tabelas.
- **Sem offline sync**: O CRM requer conexão com internet para funcionar.
- **Notificações**: V1 não inclui notificações automáticas de pagamentos atrasados.
- **Relatórios**: V1 não inclui relatórios avançados; use o Supabase Dashboard para análises.

## Roadmap

- [ ] Multi-tenant com roles (admin/trainer) e RLS scoping
- [ ] Notificações de pagamentos atrasados
- [ ] Relatórios e analytics
- [ ] Importação/exportação de alunos (CSV)
- [ ] App mobile (React Native)
- [ ] Integração com pagamentos (Stripe/PIX)

## Suporte

Para questões técnicas, consulte o código ou a documentação do Supabase em https://supabase.com/docs
