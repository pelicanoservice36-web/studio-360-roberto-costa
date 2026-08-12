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

## Deploy no Cloudflare Pages

1. Conecte o repositório GitHub ao Cloudflare Pages
2. Configure:
   - **Root directory**: `crm`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Defina as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático a cada commit

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

- **RLS (Row Level Security)**: Atualmente, qualquer usuário autenticado pode ler/escrever todos os dados. Em futuros updates, será implementado escopo por trainer.
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
