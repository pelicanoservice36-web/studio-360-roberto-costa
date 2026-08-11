# Studio 360 — Roberto Costa

Site institucional estático (HTML/CSS puro, sem build) para o Studio 360 do Roberto Costa.

## Estrutura

- `index.html` — página principal (hero, método, serviços, sobre, depoimentos, studio, FAQ)
- `diagnostico.html` — página de diagnóstico
- `plano.html` — página de plano
- `assets/roberto.jpg` — foto do Roberto usada no hero e na seção "Sobre"

## Deploy

Publicado no Netlify: https://studio360-roberto-costa-demo.netlify.app
Site ID: `93165992-5b1c-460a-9f6d-775849378f48`

Para reimplantar, zipe o conteúdo desta pasta (exceto arquivos ocultos) e envie via Netlify CLI/MCP ou arraste no painel do Netlify.

## Pendências conhecidas

- Fotos dos 3 depoimentos (`imagens/aluno-1.jpg`, `aluno-2.jpg`, `aluno-3.jpg`) e `og:image` ainda não têm imagem real.
- `<meta name="robots" content="noindex, nofollow">` está ativo de propósito (projeto de demonstração, sem indexação no Google).
- **Endereço divergente:** o site do cliente (360robertocosta.com) informa "Av. Mascote, 486 sala 24 — Vila Mascote"; o Google Maps e esta landing usam "R. Madre Emilie de Villeneuve, 509B — Vila Santa Catarina". Confirmar com o Roberto qual está ativo e corrigir a ficha do Google Meu Negócio.
- **Horários divergentes:** o site do cliente diz "seg a sáb, 06:00–22:00"; o Google Maps registra aberturas às 4h40/5h30. Confirmar.
- `assets/roberto.jpg` é uma foto de referência (banco de imagens) — substituir por foto real do Roberto. O tratamento de camada única no CSS assume fundo de estúdio escuro e uniforme.
