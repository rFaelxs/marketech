# UI Kit · Administrador

Componentes e telas do fluxo do **Administrador** (gestão da operação).

## Telas (em `Marketech.html`, role `admin`)
1. **Dashboard** — 3 KPIs (Receita do mês, Pedidos ativos, Clientes ativos), gráfico Vendas por dia, Top 5 Produtos mais vendidos.
2. **Gerenciar Usuários** — tabela de operadores + clientes, ações Cadastrar Operador, Definir Permissões, Remover (soft delete).

## Componentes nesta pasta
- `Components.jsx`:
  - `<KPICard label value delta direction>` — cartão de KPI com delta colorido
  - `<BarChart data>` — barras verticais simples, escala automática ao máximo
  - `<TopProductList items>` — ranking horizontal
  - `<UserRow user onRemove onSetPerms>` — linha de usuário com avatar

## Visualização
Abra `index.html` ou `../../Marketech.html#role=admin`.

## Notas
- KPIs usam `JetBrains Mono` para o valor (tabular nums) e Manrope para label/delta.
- “Remover” faz **soft delete** (apenas marca `active=false`); a UI mantém a linha com badge cinza.
- Gráfico é SVG-free — só `<div>` com `height: %`. Fácil de trocar por Recharts/Chart.js em produção.
