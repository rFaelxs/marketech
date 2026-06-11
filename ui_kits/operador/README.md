# UI Kit · Operador

Componentes e telas do fluxo do **Operador** (chão de loja).

## Telas (em `Marketech.html`, role `operador`)
1. **Fila de Pedidos** — Kanban (Aguardando / Separando / Pronto) com alerta vermelho para > 20 min e botão “Imprimir Comanda”.
2. **Painel de Produtos** — tabela com busca por EAN, ações Cadastrar / Editar Preço / Atualizar Estoque / Ativar-Desativar.

## Componentes nesta pasta
- `Components.jsx`:
  - `<KanbanColumn id label icon orders>` — coluna do board
  - `<KanbanCard order>` — card de pedido (acende vermelho se `late`)
  - `<ProductRow product onEditPrice onEditStock onToggle>` — linha da tabela de produtos

## Visualização
Abra `index.html` ou `../../Marketech.html#role=operador`.

## Notas
- Pedidos com `minutesAgo > 20` ganham `late=true` e a classe `.kanban-card.late` (borda + fundo vermelhos).
- “Imprimir Comanda” abre um modal com a comanda formatada — em produção, isso vira `window.print()` numa rota dedicada `/comanda/:id`.
- Edição de preço/estoque usa modal isolado para evitar undo acidental.
