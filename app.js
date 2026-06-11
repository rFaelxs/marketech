/* ============================================================
   MARKETECH — Mock Data & App State
   ============================================================ */

const MOCK = {
  user: {
    nome: 'Rafael Siqueira',
    email: 'rafael@email.com',
    cpf_masked: '***.456.789-**',
    avatar: 'RS'
  },

  categories: [
    { id: 1, icon: '🥩', nome: 'Carnes' },
    { id: 2, icon: '🥦', nome: 'Hortifruti' },
    { id: 3, icon: '🥛', nome: 'Laticínios' },
    { id: 4, icon: '🍞', nome: 'Padaria' },
    { id: 5, icon: '🥤', nome: 'Bebidas' },
    { id: 6, icon: '🧹', nome: 'Limpeza' },
  ],

  products: [
    { id:1,  nome:'Arroz Tio João 5kg',       preco:22.90, estoque:45, cat:'Básicos',   emoji:'🌾', disponivel:true  },
    { id:2,  nome:'Feijão Carioca 1kg',        preco:8.49,  estoque:30, cat:'Básicos',   emoji:'🫘', disponivel:true  },
    { id:3,  nome:'Peito de Frango kg',        preco:14.99, estoque:12, cat:'Carnes',    emoji:'🍗', disponivel:true  },
    { id:4,  nome:'Leite Integral 1L',         preco:4.89,  estoque:0,  cat:'Laticínios',emoji:'🥛', disponivel:false },
    { id:5,  nome:'Iogurte Natural 170g',      preco:3.29,  estoque:20, cat:'Laticínios',emoji:'🍶', disponivel:true  },
    { id:6,  nome:'Pão de Forma Wickbold',     preco:7.90,  estoque:8,  cat:'Padaria',   emoji:'🍞', disponivel:true  },
    { id:7,  nome:'Suco Del Valle 1L',         preco:6.49,  estoque:0,  cat:'Bebidas',   emoji:'🧃', disponivel:false },
    { id:8,  nome:'Detergente Ypê 500ml',      preco:2.99,  estoque:55, cat:'Limpeza',   emoji:'🧴', disponivel:true  },
    { id:9,  nome:'Macarrão Barilla 500g',     preco:5.49,  estoque:35, cat:'Básicos',   emoji:'🍝', disponivel:true  },
    { id:10, nome:'Queijo Mussarela 500g',     preco:18.90, estoque:0,  cat:'Laticínios',emoji:'🧀', disponivel:false },
  ],

  pedidos_kanban: [
    { id:'#4821', cliente:'Ana Lima',      itens:'3 itens',  valor:'R$ 67,40', status:'confirmado', tempo:3,  tempoLabel:'3 min' },
    { id:'#4820', cliente:'Carlos Mendes', itens:'5 itens',  valor:'R$ 142,90',status:'confirmado', tempo:7,  tempoLabel:'7 min' },
    { id:'#4819', cliente:'Maria Santos',  itens:'2 itens',  valor:'R$ 38,20', status:'separacao',  tempo:24, tempoLabel:'24 min', alert:true },
    { id:'#4818', cliente:'João Costa',    itens:'7 itens',  valor:'R$ 215,00',status:'separacao',  tempo:11, tempoLabel:'11 min' },
    { id:'#4817', cliente:'Lucia Ferreira',itens:'4 itens',  valor:'R$ 89,50', status:'separacao',  tempo:22, tempoLabel:'22 min', alert:true },
    { id:'#4816', cliente:'Pedro Alves',   itens:'6 itens',  valor:'R$ 176,30',status:'transporte', tempo:18, tempoLabel:'18 min' },
    { id:'#4815', cliente:'Fernanda Dias', itens:'3 itens',  valor:'R$ 54,10', status:'transporte', tempo:35, tempoLabel:'35 min' },
    { id:'#4814', cliente:'Roberto Lima',  itens:'9 itens',  valor:'R$ 298,70',status:'entregue',   tempo:52, tempoLabel:'52 min' },
    { id:'#4813', cliente:'Camila Nunes',  itens:'2 itens',  valor:'R$ 41,80', status:'entregue',   tempo:68, tempoLabel:'68 min' },
  ],

  cupons: { 'DEMO10': { tipo:'PERCENTUAL', valor:10, label:'10% OFF' } }
};

/* App state */
const STATE = {
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  coupon: null,
  selectedProduct: null,
  checkoutStep: 1,
  orderPlaced: false,
};

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, type = 'default', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, duration);
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
let currentMobileScreen = 'splash';
const mobileScreens = ['splash','onboarding','login','cadastro','home','produto','carrinho','checkout','confirmacao','pedido'];

function goTo(screenId) {
  document.querySelectorAll('.mobile-screen').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById('screen-' + screenId);
  if (target) { target.classList.remove('hidden'); currentMobileScreen = screenId; }
  updateDemoNav();
}

function updateDemoNav() {
  const label = document.getElementById('demo-current-label');
  const names = {
    splash:'Splash Screen', onboarding:'Onboarding', login:'Login',
    cadastro:'Cadastro', home:'Home / Catálogo', produto:'Detalhe do Produto',
    carrinho:'Carrinho', checkout:'Checkout', confirmacao:'Confirmação', pedido:'Rastreio do Pedido'
  };
  if (label) label.textContent = names[currentMobileScreen] || currentMobileScreen;
}

/* ============================================================
   CART
   ============================================================ */
function addToCart(productId) {
  const p = MOCK.products.find(x => x.id === productId);
  if (!p || !p.disponivel) return;
  const existing = STATE.cart.find(x => x.id === productId);
  if (existing) existing.qty++;
  else STATE.cart.push({ ...p, qty: 1 });
  updateCartState();
  showToast(`${p.nome.split(' ')[0]} adicionado! 🛒`, 'success');
}

function removeFromCart(productId) {
  STATE.cart = STATE.cart.filter(x => x.id !== productId);
  updateCartState();
  renderCart();
}

function changeQty(productId, delta) {
  const item = STATE.cart.find(x => x.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartState();
  renderCart();
}

function updateCartState() {
  STATE.cartCount = STATE.cart.reduce((s, i) => s + i.qty, 0);
  STATE.cartTotal = STATE.cart.reduce((s, i) => s + i.qty * i.preco, 0);
  if (STATE.coupon) STATE.cartTotal *= (1 - STATE.coupon.valor / 100);
  // Update badge
  document.querySelectorAll('.cart-badge-count').forEach(el => {
    el.textContent = STATE.cartCount;
    el.style.display = STATE.cartCount > 0 ? 'flex' : 'none';
  });
  document.querySelectorAll('.cart-total-display').forEach(el => {
    el.textContent = fmtCurrency(STATE.cartTotal);
  });
}

function applyCoupon(code) {
  const c = MOCK.cupons[code.toUpperCase()];
  if (c) {
    STATE.coupon = c;
    updateCartState();
    renderCart();
    showToast(`Cupom aplicado: ${c.label} 🎉`, 'success');
  } else {
    showToast('Cupom inválido ou expirado', 'error');
  }
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */
function fmtCurrency(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

function renderHome() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = MOCK.products.map(p => `
    <div class="product-card card" onclick="openProduct(${p.id})">
      <div class="product-card-img">${p.emoji}</div>
      <div class="product-card-body">
        <div class="product-card-name">${p.nome}</div>
        <div class="product-card-price">${fmtCurrency(p.preco)}<span class="product-card-unit"> / un</span></div>
        ${p.disponivel
          ? `<button class="btn btn-primary btn-sm btn-full product-add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+ Adicionar</button>`
          : `<div class="badge badge-danger" style="width:100%;justify-content:center;margin-top:6px">Indisponível</div>`
        }
      </div>
    </div>
  `).join('');
}

function openProduct(id) {
  STATE.selectedProduct = MOCK.products.find(p => p.id === id);
  renderProductDetail();
  goTo('produto');
}

function renderProductDetail() {
  const p = STATE.selectedProduct;
  if (!p) return;
  const el = document.getElementById('product-detail-content');
  if (!el) return;
  el.innerHTML = `
    <div class="product-detail-hero">${p.emoji}</div>
    <div class="product-detail-info">
      <div class="product-detail-cat badge badge-neutral">${p.cat}</div>
      <h2 class="product-detail-name">${p.nome}</h2>
      <div class="product-detail-price">${fmtCurrency(p.preco)}<span class="product-detail-unit"> por unidade</span></div>
      <div class="product-detail-stock">
        ${p.disponivel
          ? `<span class="badge badge-success">✓ Em estoque (${p.estoque} un)</span>`
          : `<span class="badge badge-danger">✗ Produto indisponível</span>`}
      </div>
      <p class="product-detail-desc">Produto de qualidade selecionada, disponível para entrega em até 60 minutos na sua região. Sujeito à disponibilidade do estoque.</p>
    </div>
    <div class="product-detail-actions">
      ${p.disponivel
        ? `<button class="btn btn-primary btn-lg btn-full" onclick="addToCart(${p.id});goTo('home')">🛒 Adicionar ao Carrinho</button>`
        : `<button class="btn btn-full" disabled style="background:#f3f4f6;color:#9ca3af;padding:16px;border-radius:999px;font-weight:600">Produto Indisponível</button>`
      }
    </div>
  `;
}

function renderCart() {
  const list = document.getElementById('cart-items');
  if (!list) return;
  if (STATE.cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:48px;margin-bottom:12px">🛒</div>
        <div style="font-size:15px;font-weight:600;color:#374151;margin-bottom:6px">Carrinho vazio</div>
        <div style="font-size:13px;color:#6B7280">Adicione produtos para começar</div>
        <button class="btn btn-primary" style="margin-top:16px" onclick="goTo('home')">Ver Catálogo</button>
      </div>`;
    return;
  }
  list.innerHTML = STATE.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-price">${fmtCurrency(item.preco)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  // Summary
  const raw = STATE.cart.reduce((s,i) => s + i.qty*i.preco, 0);
  const discount = STATE.coupon ? raw * STATE.coupon.valor / 100 : 0;
  const total = raw - discount;
  document.getElementById('cart-summary').innerHTML = `
    <div class="cart-summary-row"><span>Subtotal</span><span>${fmtCurrency(raw)}</span></div>
    ${discount > 0 ? `<div class="cart-summary-row discount"><span>Desconto (${STATE.coupon.label})</span><span>− ${fmtCurrency(discount)}</span></div>` : ''}
    <div class="cart-summary-row total"><span>Total</span><span>${fmtCurrency(total)}</span></div>
  `;
}

/* ============================================================
   DEMO SKELETON LOADER
   ============================================================ */
function showSkeletonThenRender(containerId, renderFn, delay = 1200) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array(6).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton" style="height:80px;border-radius:10px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:12px;width:70%;margin-bottom:6px"></div>
      <div class="skeleton" style="height:12px;width:40%"></div>
    </div>
  `).join('');
  setTimeout(renderFn, delay);
}

/* ============================================================
   CHECKOUT STEPPER
   ============================================================ */
function setCheckoutStep(step) {
  STATE.checkoutStep = step;
  document.querySelectorAll('.checkout-step-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('checkout-step-' + step);
  if (panel) panel.classList.remove('hidden');
  document.querySelectorAll('.checkout-step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 <= step);
    dot.classList.toggle('done', i + 1 < step);
  });
}

/* ============================================================
   CEP AUTO-FILL (mock)
   ============================================================ */
function mockFetchCEP(cep) {
  const cepEl = document.getElementById('cep-input');
  if (cep.replace(/\D/g,'').length === 8) {
    showToast('CEP encontrado ✓', 'success', 1500);
    setTimeout(() => {
      const rua = document.getElementById('rua-input');
      const bairro = document.getElementById('bairro-input');
      if (rua) rua.value = 'QI 17 Bloco G';
      if (bairro) bairro.value = 'Guará II';
    }, 600);
  }
}

/* ============================================================
   WEB NAVIGATION
   ============================================================ */
let currentWebPage = 'web-login';

function goToWeb(pageId) {
  document.querySelectorAll('.web-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add('active'); currentWebPage = pageId; }
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });
}

/* ============================================================
   KANBAN RENDER
   ============================================================ */
function renderKanban() {
  const cols = { confirmado:'kanban-confirmado', separacao:'kanban-separacao', transporte:'kanban-transporte', entregue:'kanban-entregue' };
  Object.entries(cols).forEach(([status, colId]) => {
    const col = document.getElementById(colId);
    if (!col) return;
    const cards = MOCK.pedidos_kanban.filter(p => p.status === status);
    col.innerHTML = cards.map(p => `
      <div class="kanban-card ${p.alert ? 'alert' : ''}" onclick="openOrderModal('${p.id}')">
        <div class="kanban-card-id">${p.id}</div>
        <div class="kanban-card-name">${p.cliente}</div>
        <div class="kanban-card-items">${p.itens}</div>
        <div class="kanban-card-footer">
          <span class="kanban-card-value">${p.valor}</span>
          <span class="kanban-card-time ${p.alert ? 'alert' : p.tempo > 15 ? 'warn' : 'ok'}">
            ⏱ ${p.tempoLabel}
            ${p.alert ? '⚠️' : ''}
          </span>
        </div>
      </div>
    `).join('');
    // Update count badge
    const countEl = document.getElementById(colId + '-count');
    if (countEl) countEl.textContent = cards.length;
  });
}

function openOrderModal(orderId) {
  const p = MOCK.pedidos_kanban.find(x => x.id === orderId);
  if (!p) return;
  const modal = document.getElementById('order-modal');
  if (!modal) return;
  document.getElementById('modal-order-id').textContent   = p.id;
  document.getElementById('modal-order-name').textContent = p.cliente;
  document.getElementById('modal-order-items').textContent= p.itens;
  document.getElementById('modal-order-value').textContent= p.valor;
  document.getElementById('modal-order-status').textContent= p.status.toUpperCase().replace('_',' ');
  document.getElementById('modal-order-time').textContent = p.tempoLabel;
  modal.classList.remove('hidden');
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (modal) modal.classList.add('hidden');
}

/* ============================================================
   PRODUCTS TABLE (Operador)
   ============================================================ */
function renderProductTable(filter = '') {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  const products = filter
    ? MOCK.products.filter(p => p.nome.toLowerCase().includes(filter.toLowerCase()) || p.cat.toLowerCase().includes(filter.toLowerCase()))
    : MOCK.products;

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="product-cell">
          <div class="product-thumb">${p.emoji}</div>
          <div>
            <div class="product-name">${p.nome}</div>
            <div class="product-cat">${p.cat}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge ${p.disponivel ? 'badge-success' : 'badge-danger'}">
          ${p.disponivel ? '● Disponível' : '● Indisponível'}
        </span>
      </td>
      <td>
        <input class="inline-edit" type="number" value="${p.estoque}"
          min="0" onchange="updateStock(${p.id}, this.value)"
          title="Editar estoque">
      </td>
      <td>R$ <input class="inline-edit" type="number" value="${p.preco.toFixed(2)}"
        min="0" step="0.01" onchange="updatePrice(${p.id}, this.value)"
        title="Editar preço"></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-outline" onclick="toggleProduct(${p.id})">
            ${p.disponivel ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateStock(id, val) {
  const v = parseInt(val);
  if (v < 0) { showToast('Estoque não pode ser negativo', 'error'); return; }
  const p = MOCK.products.find(x => x.id === id);
  if (p) { p.estoque = v; p.disponivel = v > 0; showToast(`Estoque de ${p.nome.split(' ')[0]} atualizado ✓`, 'success'); renderProductTable(); }
}

function updatePrice(id, val) {
  const v = parseFloat(val);
  if (v < 0) { showToast('Preço não pode ser negativo', 'error'); return; }
  const p = MOCK.products.find(x => x.id === id);
  if (p) { p.preco = v; showToast(`Preço atualizado ✓`, 'success'); }
}

function toggleProduct(id) {
  const p = MOCK.products.find(x => x.id === id);
  if (p) {
    if (p.estoque === 0 && !p.disponivel) { showToast('Reponha o estoque antes de ativar', 'warning'); return; }
    p.disponivel = !p.disponivel;
    renderProductTable();
    showToast(`Produto ${p.disponivel ? 'ativado' : 'desativado'}`, p.disponivel ? 'success' : 'default');
  }
}

/* ============================================================
   REPORTS
   ============================================================ */
function renderReports() {
  // Simple SVG bar chart inline
  const chartEl = document.getElementById('sales-chart');
  if (!chartEl) return;
  const days = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const values = [4200, 5800, 3900, 7200, 6100, 9400, 8300];
  const max = Math.max(...values);
  const bars = days.map((d, i) => {
    const pct = (values[i] / max) * 140;
    const isToday = i === 5;
    return `
      <g>
        <rect x="${i * 72 + 16}" y="${160 - pct}" width="44" height="${pct}" rx="6"
          fill="${isToday ? 'var(--color-primary)' : 'var(--color-primary-10)'}"
          stroke="${isToday ? 'none' : 'var(--color-primary-20)'}" stroke-width="1"/>
        <text x="${i * 72 + 38}" y="172" text-anchor="middle" font-size="11" fill="var(--color-text-secondary)" font-family="Inter">${d}</text>
        <text x="${i * 72 + 38}" y="${155 - pct}" text-anchor="middle" font-size="10" fill="var(--color-text-secondary)" font-family="Inter">
          ${(values[i]/1000).toFixed(1)}k
        </text>
      </g>`;
  }).join('');
  chartEl.innerHTML = `
    <svg viewBox="0 0 520 185" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
      ${bars}
    </svg>`;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Detect page
  const body = document.body;
  if (body.dataset.page === 'mobile') {
    initMobile();
  } else if (body.dataset.page === 'web') {
    initWeb();
  }
});

function initMobile() {
  // Splash auto-advance
  setTimeout(() => {
    const splash = document.getElementById('screen-splash');
    if (splash && !splash.classList.contains('hidden')) goTo('onboarding');
  }, 2200);

  // Populate home with skeleton then products
  renderHome();
  updateCartState();
  updateDemoNav();
}

function initWeb() {
  renderKanban();
  renderProductTable();
  renderReports();

  // Auto-refresh kanban timer display every 30s (demo)
  setInterval(() => {
    MOCK.pedidos_kanban.forEach(p => {
      if (p.status === 'separacao') p.tempo++;
      p.alert = p.status === 'separacao' && p.tempo > 20;
      p.tempoLabel = p.tempo + ' min';
    });
    renderKanban();
  }, 30000);
}
