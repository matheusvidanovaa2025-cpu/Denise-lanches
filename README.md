# Denise Lanches — V1

Projeto Next.js mobile-first para cardápio digital.

## Rodar localmente
1. `npm install`
2. copie `.env.example` para `.env.local`
3. coloque `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. `npm run dev`

## Supabase
Execute `supabase/schema.sql` no SQL Editor do projeto.

## GitHub
Suba todos os arquivos deste diretório para um repositório novo chamado `denise-lanches`.

## Vercel
Importe o repositório e configure as duas variáveis públicas do Supabase em Environment Variables.

## Mercado Pago
A integração real deve ser feita depois por rota/server-side. Nunca coloque o access token secreto no frontend.

### Observação da V1
O painel administrativo desta primeira versão é uma interface funcional de protótipo e ainda precisa de autenticação/controle de acesso antes de uso público. O checkout já grava pedidos quando o Supabase está conectado.
