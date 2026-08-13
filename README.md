# Studio 360 — Roberto Costa

Site institucional estático (HTML/CSS puro, sem build) para o Studio 360 do Roberto Costa.

## Estrutura

- `index.html` — página principal (hero, método, serviços, sobre, depoimentos, studio, FAQ)
- `diagnostico.html` — página de diagnóstico
- `plano.html` — página de plano
- `assets/roberto-recortado.png` — foto do Roberto (fundo removido, recortada e com cor de camisa ajustada) usada no hero e na seção "Sobre"

## Deploy

Publicado como **Cloudflare Worker de assets estáticos**: https://studio-360-roberto-costa.pelicanoservice36.workers.dev/

Configuração em `wrangler.jsonc` na raiz (`assets.directory: "site"`). O deploy é acionado automaticamente a cada push no branch `main` do repositório GitHub (Git integration do Cloudflare, projeto `studio-360-roberto-costa` em Workers & Pages). Não é necessário ação manual para redeploy.

**Repositório GitHub:** https://github.com/pelicanoservice36-web/studio-360-roberto-costa

### CRM de alunos

Este repositório também hospeda o `crm/`, um app React/Vite + Supabase separado do site institucional — ver [crm/README.md](crm/README.md) para detalhes de setup e deploy. É um projeto Cloudflare distinto (`studio-360-crm`), com root directory `crm` e seu próprio `crm/wrangler.jsonc`, publicado em https://studio-360-crm.pelicanoservice36.workers.dev/.

### GitHub Actions

`.github/workflows/build-and-test.yml` e `.github/workflows/deploy.yml` rodam build/deploy do CRM via GitHub Actions como validação adicional (paralela ao deploy nativo do Cloudflare Git integration). Requerem os secrets `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` configurados em Settings → Secrets and variables → Actions.

## Pendências conhecidas

- Fotos dos 3 depoimentos reais:
  - `imagens/aluno-1.jpg` — Mariana Fonseca
  - `imagens/aluno-2.jpg` — Gabriela Crivellente
  - `imagens/aluno-3.jpg` — Rodrigo Aruake
- `og:image` ainda não tem imagem de preview (Open Graph).
- `<meta name="robots" content="noindex, nofollow">` está ativo de propósito (projeto de demonstração, sem indexação no Google).
- **Endereço divergente:** o site do cliente (360robertocosta.com) informa "Av. Mascote, 486 sala 24 — Vila Mascote"; o Google Maps e esta landing usam "R. Madre Emilie de Villeneuve, 509B — Vila Santa Catarina". Confirmar com o Roberto qual está ativo e corrigir a ficha do Google Meu Negócio.
- **Horários divergentes:** o site do cliente diz "seg a sáb, 06:00–22:00"; o Google Maps registra aberturas às 4h40/5h30. Confirmar.
- `assets/roberto.jpg` é uma foto de referência (banco de imagens) — substituir por foto real do Roberto. O tratamento de camada única no CSS assume fundo de estúdio escuro e uniforme.
