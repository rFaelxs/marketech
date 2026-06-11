# Marketech Design System

> Sistema de design para a **Marketech** — plataforma de e-commerce de mercado (supermercado online) com três perfis de usuário: **Cliente**, **Operador** e **Administrador**.

## Sobre o produto

Marketech é uma plataforma B2C/B2B para mercados que querem vender online sem perder a operação de loja física. O produto serve três audiências num só sistema:

- **Cliente** — compra de casa: navega catálogo, monta carrinho, paga (cartão ou Pix), acompanha pedido.
- **Operador** — separa pedidos no chão de loja: vê fila Kanban, imprime comanda, gerencia estoque e EAN.
- **Administrador** — cuida da operação: gerencia usuários e permissões, lê KPIs (receita, pedidos, top produtos).

A marca precisa transmitir **confiança operacional** (é dinheiro e estoque real) com **frescor de mercado** (é comida, é dia-a-dia). Não é fintech fria nem app de comida emojizado — é a virada digital do supermercado de bairro.

## Fontes

Nenhum arquivo de marca foi fornecido — todo o sistema visual e copy foi originado neste projeto a partir do briefing de produto em `prompt original` (perfis, telas obrigatórias, regras de negócio, e-mails de teste). Caso a equipe Marketech já tenha logo, fontes, ou paleta oficial, **substitua os arquivos em `assets/` e ajuste os tokens em `colors_and_type.css`** — o resto do sistema referencia esses tokens.

## Index

| Arquivo | Descrição |
|---|---|
| `README.md` | Este documento — fundamentos de conteúdo, visuais, iconografia |
| `colors_and_type.css` | Tokens base (cores, tipografia, espaçamento, sombras, raios) |
| `SKILL.md` | Manifesto para uso como Claude Skill |
| `assets/` | Logo (SVG), favicons, ilustrações genéricas |
| `preview/` | Cards do Design System (renderizados na aba DS) |
| `ui_kits/cliente/` | UI kit do app do cliente (login → checkout) |
| `ui_kits/operador/` | UI kit do operador (Kanban de pedidos, painel de produtos) |
| `ui_kits/admin/` | UI kit do administrador (dashboard de KPIs, gestão de usuários) |
| `Marketech.html` | Protótipo interativo completo (single-file, todos os perfis) |

---

## CONTENT FUNDAMENTALS

### Idioma
**Português brasileiro**, sem regionalismos fortes. Usar acentuação correta sempre (não “acoes”, “Acoes”) — é supermercado, não startup gringa.

### Tom
- **Direto, sem floreio.** “Adicionar ao carrinho”, não “Adicione já o seu produto favorito!”.
- **Operacional onde precisa ser operacional.** No fluxo do Operador, frases curtas, verbo no infinitivo: “Imprimir Comanda”, “Atualizar Estoque”. Nada de “Vamos lá! Que tal imprimir essa comanda?”.
- **Acolhedor onde toca o cliente.** Mensagens de sucesso podem ser leves: “Pedido confirmado. Já estamos separando.” — mas nunca infantis.
- **Você**, nunca “tu” nem “senhor(a)”. “Seus pedidos”, “Seu carrinho”.

### Casing
- **Sentence case** em frases e parágrafos: “Esqueci a senha”.
- **Title Case curto** em botões de ação principal: “Adicionar ao Carrinho”, “Finalizar Compra”, “Imprimir Comanda”. Verbos no infinitivo.
- **MAIÚSCULAS** só em códigos/cupons: `PROMO10`, `EAN 7891000100103`.
- Nomes de status sempre capitalizados: **Confirmado**, **Separando**, **Em Transporte**, **Entregue**.

### Exemplos de copy

**Sucesso (toast)**
> Cupom PROMO10 aplicado — 10% de desconto.
> Item adicionado ao carrinho.
> Pedido confirmado. Já estamos separando.

**Erro (inline)**
> E-mail ou senha incorretos.
> Estoque insuficiente. Restam 2 unidades.
> CEP não encontrado.

**Estados vazios**
> Seu carrinho está vazio. [Ver catálogo →]
> Nenhum pedido na fila. Aproveite o respiro.

**Confirmação destrutiva**
> Remover este item do carrinho?  [Cancelar] [Remover] — com botão “Desfazer” no toast por 5s.

### Emoji
**Não usamos emoji** em UI. Status, alertas e categorias usam ícones (Lucide). Emoji é confundido com tom infantil e quebra densidade de tabelas/listas.

### Números, preços, datas
- Preços: `R$ 12,90` — sempre com `R$ ` (espaço), vírgula decimal, sem milhar abaixo de mil. Acima: `R$ 1.250,00`.
- Datas: `28 mai 2026` em listas; `28/05/2026 14:32` em logs/comandas.
- Estoque: `12 un.` (unidades), `kg`, `g` quando aplicável.
- Códigos EAN: monoespaçados, agrupados — `789 1000 100103`.

---

## VISUAL FOUNDATIONS

### Tipografia
- **Display & UI: Manrope** (Google Fonts) — geométrica, levemente arredondada, pesos 400/500/600/700/800. Boa em densidade e em títulos grandes.
- **Mono: JetBrains Mono** — preços tabulados, EANs, IDs de pedido (`#MK-1042`), horários.
- Escala em `colors_and_type.css` (`--text-xs` a `--text-5xl`). H1 = 40px / 1.1 / 700; corpo = 15px / 1.5 / 400.

### Cores
- **Primary (Marketech Blue) `#2563EB`** — ações primárias, links, foco. Escala de 50→900.
- **Verde Mercado `#16A34A`** — sucesso, “em estoque”, status “Confirmado”/“Entregue”. Não é a cor primária; é o sotaque de frescor.
- **Âmbar `#F59E0B`** — atenção, status “Separando”/“Em Transporte”, estoque baixo.
- **Vermelho `#DC2626`** — destrutivo, alerta de pedido > 20min, erro.
- **Neutros (Zinc):** `--surface-0` (branco) → `--surface-1` (#FAFAFA) → `--surface-2` (#F4F4F5) → bordas em `#E4E4E7`. Texto: `--fg-1` (#18181B), `--fg-2` (#52525B), `--fg-3` (#A1A1AA).
- Imagens de produto: fundo branco / cinza muito claro, sem grão, sem filtros frios.

### Backgrounds
- **Branco e cinza-50 (`#FAFAFA`) dominam.** Nada de gradientes decorativos no chrome.
- **Um único gradiente é permitido** — banner hero no Login do Cliente: `linear-gradient(135deg, #2563EB → #1E40AF)` sólido, sem mancha purpura.
- Cards e produto sobre branco; **shell do app (sidebar/topbar) sobre `--surface-1`** para destacar conteúdo.

### Espaçamento
Escala base 4px: `--space-1` 4 / `--space-2` 8 / `--space-3` 12 / `--space-4` 16 / `--space-5` 24 / `--space-6` 32 / `--space-8` 48 / `--space-10` 64.
Padding padrão de card: 16–24px. Gutter de grid: 16px (mobile) / 24px (desktop).

### Cantos
- **Raio padrão `--radius-md` = 10px** — botões, inputs, cards.
- `--radius-sm` = 6px — chips, badges, tags de status.
- `--radius-lg` = 16px — modais, hero cards, painéis de checkout.
- **Sem `border-radius: 9999px` pill** exceto em badges de contagem (carrinho).

### Sombras
Sistema de elevação leve, sem dramaticidade:
- `--shadow-xs` — `0 1px 2px rgb(0 0 0 / 0.04)` — inputs, cards de listagem.
- `--shadow-sm` — `0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)` — cards interativos em hover.
- `--shadow-md` — `0 6px 16px rgb(0 0 0 / 0.08)` — menus, dropdowns, toast.
- `--shadow-lg` — `0 16px 40px rgb(0 0 0 / 0.12)` — modais, sheet de checkout.
- Sem inset shadows. Sem glow colorido.

### Bordas
- Largura `1px` quase sempre. `1.5px` em estado focado para dar peso sem deslocar layout.
- Cor padrão: `--border-1` (#E4E4E7). Hover: `--border-2` (#D4D4D8). Focus: `--primary-500`.
- Tabelas: linha horizontal apenas, sem grade fechada.

### Animação
- **Easing único:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (suave-out, sem bounce).
- **Durações:** 120ms (hover/press, micro), 200ms (toast in/out, dropdown), 300ms (troca de tela, sheet).
- Fades + slide-up de 4–8px em entradas. **Sem bounce, sem spring exagerado.**
- Skeleton loader em tons cinza, shimmer leve (1.2s loop).

### Estados
- **Hover (botão primário):** `--primary-600` → `--primary-700` (escurece). Sem mudança de tamanho.
- **Hover (botão secundário):** fundo `--surface-2`. Borda mantida.
- **Hover (card de produto):** sombra sobe para `--shadow-sm`, `translateY(-1px)`, 120ms.
- **Press / active:** `transform: scale(0.98)` em 80ms.
- **Focus visible:** anel `2px solid --primary-500` com `offset 2px`, **nunca** outline default do navegador.
- **Disabled:** opacity 0.5, sem ponteiro.

### Transparência e blur
Usadas com parcimônia:
- Backdrop do modal: `rgb(24 24 27 / 0.5)`, **sem blur** (mantém performance em loja).
- Topbar sticky: fundo `rgb(255 255 255 / 0.85)` + `backdrop-filter: blur(8px)` no scroll.
- Toast: fundo sólido (não vidro) — precisa ler em loja com iluminação ruim.

### Cards
- Fundo branco, borda `1px --border-1`, raio 10px, padding 16–20px, sombra `--shadow-xs`.
- Card de produto: imagem 1:1 no topo (sem padding), info abaixo. Sem texto sobre imagem.
- Card KPI (admin): número grande (40–48px, weight 700), label pequena acima (12px uppercase, --fg-3), delta% colorido.

### Layout
- Container max 1280px, centrado, padding lateral 24px (desktop) / 16px (mobile).
- Sidebar fixa 240px no shell do app autenticado; recolhe para 64px em <1024px (ícones only).
- Topbar fixa 64px com seletor de perfil sempre visível à direita.
- Mobile: sidebar vira drawer. Breakpoints: 768 (tablet), 1024 (laptop), 1280 (desktop).

### Imagery
- Fotos de produto: fundo neutro, iluminação natural, cores quentes-neutras. **Sem grão, sem b&w, sem filtros frios.** No protótipo usamos `picsum.photos` como placeholder — em produção, fotos reais do mercado.

---

## ICONOGRAPHY

**Sistema:** [Lucide](https://lucide.dev) via CDN — `https://unpkg.com/lucide@latest/dist/umd/lucide.js`.

**Por quê:** stroke consistente (1.5–2px), conjunto amplo (1500+ ícones), licença permissiva, fácil de trocar por outro sistema stroke-based depois sem rework visual.

**Substituição flag:** nenhum icon set foi fornecido pela Marketech — Lucide é a escolha do design system. Caso a equipe prefira Phosphor, Heroicons, ou um set custom, basta trocar o `<script>` e mapear nomes.

**Uso:**
- Tamanho padrão `20px` em botões e itens de menu, `16px` em chips/badges, `24px` em headers de seção.
- Stroke `2px`. Cor herda de `currentColor` — definida pelo contexto.
- Ícones-chave: `ShoppingCart`, `Search`, `Filter`, `Tag`, `MapPin`, `CreditCard`, `QrCode`, `Package`, `Truck`, `CheckCircle2`, `AlertTriangle`, `Printer`, `BarChart3`, `Users`, `Settings`, `LogOut`, `User`, `Boxes`, `ClipboardList`.

**Emoji:** não usado. **Unicode (×, ↓, ✓):** evitado em UI; usar Lucide. Aceitável apenas como caractere tipográfico em copy corrida.

**SVG inline:** logo Marketech em `assets/logo.svg` (cópia única, referenciada por path). Não desenhamos ícones em SVG inline a cada uso — sempre via Lucide.
