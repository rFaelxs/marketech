# UI Kit · Cliente

Componentes e telas do fluxo do **Cliente** na Marketech.

## Telas (em `Marketech.html`, role `cliente`)
1. **Login** — formulário e-mail/senha, link “Esqueci a senha”, link “Criar Conta”
2. **Catálogo** — grid de produtos, busca, filtro de categoria, range de preço
3. **Detalhe do produto** — imagem, descrição, info nutricional, stepper de qtd
4. **Carrinho** — linha por item, qtd editável, cupom, subtotal/desconto/total, “Desfazer 5s”
5. **Checkout** — entrega/retirada, endereço, Cartão/Pix com QR Code
6. **Confirmação** — pedido aceito
7. **Meus Pedidos** — lista com régua de progresso, botão cancelar (se aplicável)

## Componentes nesta pasta
- `Components.jsx` — referência JSX:
  - `<Button variant size>` — primary, secondary, ghost, danger
  - `<ProductCard product onAdd onOpen>`
  - `<OrderProgress status>` — régua Confirmado → Entregue
  - `<CouponInput onApply>` — valida `PROMO10`

## Visualização
Abra `index.html` (auto-boota como Cliente) ou `../../Marketech.html#role=cliente`.

## Notas de implementação
- Preços usam `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Estoque: `0` → indisponível, `<5` → atenção (âmbar), `≥5` → verde.
- Toast de adição: 3s, sem CTA. Toast de remoção: 5s com botão **Desfazer**.
