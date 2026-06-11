/* ============================================================
 * Marketech — App
 * Tiny SPA: state + screen renderers + event delegation.
 * ============================================================ */
(function () {
  'use strict';
  const { PRODUCTS, ORDERS, QUEUE_ORDERS, USERS, SALES_BY_DAY, TOP_PRODUCTS, CATEGORIES, TEST_EMAILS } = window.MARKETECH_DATA;

  // -----------------------------------------------------------
  // State
  // -----------------------------------------------------------
  const state = {
    user: null,                 // {email, role}
    role: null,                 // 'cliente' | 'operador' | 'admin'
    screen: 'onboarding',
    cart: [],                   // [{productId, qty}]
    coupon: null,               // 'PROMO10' | null
    selectedProductId: null,
    deliveryMode: 'delivery',
    paymentMode: 'card',
    catalog: { search: '', category: null, priceMin: '', priceMax: '' },
    productSearch: '',
    orders: ORDERS.slice(),
    queue: QUEUE_ORDERS.slice(),
    products: PRODUCTS.slice(),
    users: USERS.slice(),
    confirmedOrder: null,
    roleMenuOpen: false,
    modal: null,                // { type, payload }
    onboardingSlide: 0,
    recoveryEmailSent: false,
  };

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  const $ = (sel) => document.querySelector(sel);
  const moneyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const money = (n) => moneyFmt.format(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const productById = (id) => state.products.find(p => p.id === id);
  const cartCount = () => state.cart.reduce((s, x) => s + x.qty, 0);
  const cartSubtotal = () => state.cart.reduce((s, x) => s + (productById(x.productId)?.price || 0) * x.qty, 0);
  const cartDiscount = () => state.coupon === 'PROMO10' ? cartSubtotal() * 0.10 : 0;
  const deliveryFee = () => state.deliveryMode === 'delivery' ? 8.90 : 0;
  const cartTotal = () => cartSubtotal() - cartDiscount() + deliveryFee();

  function maskCpf(cpf) {
    if (!cpf) return '***.***.***-**';
    const d = cpf.replace(/\D/g, '');
    if (d.length !== 11) return cpf;
    return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
  }

  function icon(name, size = 18) {
    return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;flex-shrink:0"></i>`;
  }
  function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

  // -----------------------------------------------------------
  // Toast
  // -----------------------------------------------------------
  let toastSeq = 0;
  function toast(msg, opts = {}) {
    const id = ++toastSeq;
    const type = opts.type || 'success';
    const iconMap = { success: 'check', info: 'info', warn: 'triangle-alert', error: 'x' };
    const stack = $('#toast-stack');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.dataset.toastId = id;
    el.innerHTML = `
      <div class="icon">${icon(iconMap[type], 14)}</div>
      <div class="msg">${esc(msg)}</div>
      ${opts.undo ? `<button class="undo" data-action="undo-toast" data-id="${id}">Desfazer</button>` : ''}
    `;
    stack.appendChild(el);
    refreshIcons();
    const dismiss = () => {
      el.classList.add('exit');
      setTimeout(() => el.remove(), 200);
      if (opts.onTimeout) opts.onTimeout();
    };
    const timer = setTimeout(dismiss, opts.duration || 3000);
    if (opts.undo) {
      el.querySelector('[data-action="undo-toast"]').addEventListener('click', () => {
        clearTimeout(timer);
        opts.undo();
        el.classList.add('exit');
        setTimeout(() => el.remove(), 200);
      });
    }
  }

  // -----------------------------------------------------------
  // Render dispatch
  // -----------------------------------------------------------
  function render() {
    const root = $('#app');
    const preAuth = { login: renderLogin, onboarding: renderOnboarding, signup: renderSignup, 'password-recovery': renderPasswordRecovery };
    if (preAuth[state.screen]) {
      root.innerHTML = preAuth[state.screen]();
    } else {
      root.innerHTML = renderShell(renderCurrentScreen());
    }
    renderModal();
    refreshIcons();
  }

  function renderCurrentScreen() {
    const map = {
      catalog: renderCatalog, product: renderProductDetail, cart: renderCart,
      checkout: renderCheckout, confirmation: renderConfirmation, orders: renderOrders,
      products: renderProductsPanel, queue: renderQueue,
      users: renderUsers, dashboard: renderDashboard, profile: renderProfile,
    };
    const fn = map[state.screen] || (() => '<div>Tela não encontrada</div>');
    return `<div class="screen-mount" key="${state.screen}">${fn()}</div>`;
  }

  // -----------------------------------------------------------
  // LOGIN
  // -----------------------------------------------------------
  function renderLogin() {
    return `
      <div class="login-shell">
        <div class="login-hero">
          <img src="assets/logo-white.svg" width="180" alt="Marketech">
          <div>
            <h1>O seu mercado, agora online.</h1>
            <p>Plataforma única para clientes, operação de loja e gestão. Sem app pra baixar, sem fricção.</p>
            <div class="points">
              <div class="point"><span class="pill">${icon('shopping-bag', 14)}</span> Catálogo, carrinho e Pix em poucos cliques</div>
              <div class="point"><span class="pill">${icon('boxes', 14)}</span> Operação na loja com Kanban e comanda</div>
              <div class="point"><span class="pill">${icon('bar-chart-3', 14)}</span> Dashboard de KPIs em tempo real</div>
            </div>
          </div>
          <div style="font-size:12px;color:rgb(255 255 255 / 0.6)">© 2026 Marketech · v1.0</div>
        </div>
        <div class="login-form-wrap">
          <form class="login-form" data-action="submit-login" onsubmit="return false;">
            <h2>Entrar</h2>
            <div class="sub">Acesse sua conta para continuar.</div>
            <div class="field">
              <label class="field-label">E-mail</label>
              <input class="input" type="email" name="email" placeholder="seu@email.com" value="cliente@test.com" required>
            </div>
            <div class="field">
              <label class="field-label">Senha</label>
              <input class="input" type="password" name="password" placeholder="••••••••" value="senha123" required>
              <div class="links">
                <a href="#" data-action="forgot">Esqueci a senha</a>
                <a href="#" data-action="signup">Criar Conta</a>
              </div>
              <div class="err" id="login-err" style="display:none">E-mail ou senha incorretos.</div>
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="height:44px">Entrar</button>
            <div class="hint">
              <strong>Contas de teste:</strong><br>
              <code>cliente@test.com</code> → Catálogo<br>
              <code>operador@test.com</code> → Fila de Pedidos<br>
              <code>admin@test.com</code> → Dashboard
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // ONBOARDING
  // -----------------------------------------------------------
  function renderOnboarding() {
    const slides = [
      { icon: 'shopping-bag',   title: 'Compras sem fricção',    desc: 'Catálogo completo, carrinho e Pix em menos de 3 minutos. Sem app para baixar.', bg: 'var(--primary-50)', color: 'var(--primary-500)' },
      { icon: 'truck',          title: 'Entrega em 60 minutos',  desc: 'Em casa ou retirada na loja. Acompanhe o status do seu pedido em tempo real.',   bg: 'var(--green-50)',   color: 'var(--green-500)'   },
      { icon: 'badge-percent',  title: 'Ofertas exclusivas',     desc: 'Cupons e promoções para membros. Use PROMO10 no seu primeiro pedido.',            bg: 'var(--amber-50)',   color: 'var(--amber-600)'   },
    ];
    const s = slides[state.onboardingSlide];
    const isLast = state.onboardingSlide === slides.length - 1;
    return `
      <div class="onboarding-shell">
        <div class="onboarding-topbar">
          <img src="assets/logo.svg" alt="Marketech" height="28">
          <button class="btn btn-ghost btn-sm" data-action="onboarding-skip">Pular</button>
        </div>
        <div class="onboarding-body">
          <div class="onboarding-icon" style="background:${s.bg};color:${s.color}">
            ${icon(s.icon, 48)}
          </div>
          <h2 class="onboarding-title">${esc(s.title)}</h2>
          <p class="onboarding-desc">${esc(s.desc)}</p>
        </div>
        <div class="onboarding-footer">
          <div class="slide-dots">
            ${slides.map((_, i) => `<div class="dot ${i === state.onboardingSlide ? 'active' : ''}"></div>`).join('')}
          </div>
          <button class="btn btn-primary" style="width:100%;max-width:320px;height:48px;font-size:16px" data-action="${isLast ? 'onboarding-goto-signup' : 'onboarding-next'}">
            ${isLast ? `Criar Conta ${icon('arrow-right', 16)}` : `Próximo ${icon('arrow-right', 16)}`}
          </button>
          <div style="margin-top:14px;font-size:14px;color:var(--fg-2)">
            Já tem conta? <a href="#" data-action="onboarding-skip">Entrar</a>
          </div>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // SIGNUP
  // -----------------------------------------------------------
  function renderSignup() {
    return `
      <div class="login-shell">
        <div class="login-hero">
          <img src="assets/logo-white.svg" width="180" alt="Marketech">
          <div>
            <h1>Crie sua conta.</h1>
            <p>Acesse o melhor mercado online da sua região. Rápido, sem burocracia.</p>
          </div>
          <div style="font-size:12px;color:rgb(255 255 255 / 0.6)">© 2026 Marketech · v1.0</div>
        </div>
        <div class="login-form-wrap">
          <form class="login-form" data-action="submit-signup" onsubmit="return false;">
            <h2>Criar Conta</h2>
            <div class="sub">Preencha seus dados para começar.</div>
            <div class="field">
              <label class="field-label">Nome completo</label>
              <input class="input" type="text" name="name" placeholder="Seu nome completo" required>
            </div>
            <div class="field">
              <label class="field-label">E-mail</label>
              <input class="input" type="email" name="email" placeholder="seu@email.com" required>
            </div>
            <div class="field">
              <label class="field-label">CPF</label>
              <input class="input" type="text" name="cpf" placeholder="000.000.000-00" maxlength="14" data-action="cpf-input" required>
            </div>
            <div class="field">
              <label class="field-label">Senha</label>
              <input class="input" type="password" name="password" placeholder="Mínimo 6 caracteres" minlength="6" required>
            </div>
            <div class="field">
              <label class="field-label">Confirmar senha</label>
              <input class="input" type="password" name="confirm" placeholder="Repita a senha" required>
              <div class="err" id="signup-err" style="display:none"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="height:44px">Criar Conta</button>
            <div style="text-align:center;margin-top:16px;font-size:14px;color:var(--fg-2)">
              Já tem conta? <a href="#" data-action="back-to-login">Entrar</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // PASSWORD RECOVERY
  // -----------------------------------------------------------
  function renderPasswordRecovery() {
    return `
      <div class="login-shell">
        <div class="login-hero">
          <img src="assets/logo-white.svg" width="180" alt="Marketech">
          <div>
            <h1>Recuperar acesso.</h1>
            <p>Enviaremos um link de redefinição para o seu e-mail cadastrado.</p>
          </div>
          <div style="font-size:12px;color:rgb(255 255 255 / 0.6)">© 2026 Marketech · v1.0</div>
        </div>
        <div class="login-form-wrap">
          <form class="login-form" data-action="submit-recovery" onsubmit="return false;">
            <h2>Esqueci a senha</h2>
            <div class="sub">Informe o e-mail da sua conta.</div>
            ${state.recoveryEmailSent ? `
              <div class="recovery-success">
                ${icon('check-circle-2', 20)}
                <div>
                  <div style="font-weight:600">E-mail enviado!</div>
                  <div style="font-size:13px;margin-top:2px">Se este endereço estiver cadastrado, você receberá as instruções em breve.</div>
                </div>
              </div>
            ` : `
              <div class="field">
                <label class="field-label">E-mail</label>
                <input class="input" type="email" name="email" placeholder="seu@email.com" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block" style="height:44px">Enviar link de recuperação</button>
            `}
            <div style="text-align:center;margin-top:20px;font-size:14px">
              <a href="#" data-action="back-to-login" style="display:inline-flex;align-items:center;gap:4px;color:var(--fg-2)">
                ${icon('arrow-left', 14)} Voltar ao login
              </a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // PROFILE (cliente)
  // -----------------------------------------------------------
  function renderProfile() {
    const u = state.user;
    const userData = state.users.find(x => x.email === u?.email);
    const cpf = userData?.cpf || u?.cpf || '000.000.000-00';
    const addresses = [
      { label: 'Casa',     street: 'Rua das Palmeiras, 240', complement: 'Apto 51',  neighborhood: 'Vila Mariana', city: 'São Paulo / SP', cep: '04567-000' },
      { label: 'Trabalho', street: 'Av. Paulista, 1100',     complement: 'Sala 203', neighborhood: 'Bela Vista',   city: 'São Paulo / SP', cep: '01310-100' },
    ];
    return `
      <div class="profile-page">
        <div class="profile-avatar-block">
          <div class="profile-avatar">${(u?.name || '?').charAt(0).toUpperCase()}</div>
          <div>
            <div class="profile-name">${esc(u?.name || 'Usuário')}</div>
            <div class="profile-email">${esc(u?.email || '')}</div>
          </div>
        </div>
        <div class="profile-section">
          <h4>Dados pessoais</h4>
          <div class="profile-field"><span class="label">Nome</span><span class="value">${esc(u?.name || '')}</span></div>
          <div class="profile-field"><span class="label">E-mail</span><span class="value">${esc(u?.email || '')}</span></div>
          <div class="profile-field"><span class="label">CPF</span><span class="value mono">${esc(maskCpf(cpf))}</span></div>
        </div>
        <div class="profile-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <h4 style="margin:0">Endereços</h4>
            <button class="btn btn-secondary btn-sm" data-action="add-address">${icon('plus', 14)} Adicionar</button>
          </div>
          ${addresses.map(a => `
            <div class="address-card">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;color:var(--fg-2)">
                ${icon('map-pin', 14)}
                <span style="font-weight:600;font-size:13px;color:var(--fg-1)">${esc(a.label)}</span>
              </div>
              <div style="font-size:14px;color:var(--fg-1)">${esc(a.street)}${a.complement ? ', ' + esc(a.complement) : ''}</div>
              <div style="font-size:12px;color:var(--fg-2);margin-top:2px">${esc(a.neighborhood)} · ${esc(a.city)} · CEP ${esc(a.cep)}</div>
            </div>
          `).join('')}
        </div>
        <div class="profile-section">
          <button class="btn btn-secondary btn-block" data-action="logout" style="height:44px;color:var(--red-600);border-color:var(--red-100)">
            ${icon('log-out', 16)} Sair da conta
          </button>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // SHELL (sidebar + topbar)
  // -----------------------------------------------------------
  function renderShell(inner) {
    const navItems = navForRole(state.role);
    const screenTitles = {
      catalog: 'Catálogo', product: 'Detalhe do Produto', cart: 'Carrinho',
      checkout: 'Checkout', confirmation: 'Pedido Confirmado', orders: 'Meus Pedidos',
      products: 'Painel de Produtos', queue: 'Fila de Pedidos',
      users: 'Gerenciar Usuários', dashboard: 'Dashboard', profile: 'Meu Perfil',
    };
    const u = state.user;
    const initial = (u?.name || u?.email || '?').slice(0, 1).toUpperCase();
    return `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="sidebar-brand"><img src="assets/logo.svg" alt="Marketech"></div>
          <div class="sidebar-section">
            <div class="sidebar-label">${roleLabel(state.role)}</div>
            ${navItems.map(item => `
              <div class="nav-item ${state.screen === item.screen ? 'active' : ''}" data-action="nav" data-screen="${item.screen}">
                ${icon(item.icon)}
                <span class="label-text">${item.label}</span>
                ${item.screen === 'cart' && cartCount() > 0 ? `<span class="count">${cartCount()}</span>` : ''}
              </div>
            `).join('')}
          </div>
          <div style="flex:1"></div>
          <div class="sidebar-section">
            <div class="nav-item" data-action="logout">${icon('log-out')}<span class="label-text">Sair</span></div>
          </div>
        </aside>
        <main class="main">
          <header class="topbar">
            <div class="topbar-title">${screenTitles[state.screen] || ''}</div>
            <div class="topbar-right">
              <div class="role-switcher">
                <button class="role-trigger" data-action="toggle-role-menu">
                  <span class="avatar">${initial}</span>
                  <span>${roleLabel(state.role)}</span>
                  ${icon('chevron-down', 14)}
                </button>
                ${state.roleMenuOpen ? renderRoleMenu() : ''}
              </div>
            </div>
          </header>
          <div class="content">${inner}</div>
        </main>
      </div>
    `;
  }

  function renderRoleMenu() {
    const roles = [
      { id: 'cliente',  screen: 'catalog',   label: 'Cliente',       desc: 'Comprar produtos' },
      { id: 'operador', screen: 'queue',     label: 'Operador',      desc: 'Separar pedidos' },
      { id: 'admin',    screen: 'dashboard', label: 'Administrador', desc: 'KPIs e gestão' },
    ];
    return `
      <div class="role-menu">
        <div style="padding:8px 10px;font-size:11px;color:var(--fg-3);font-weight:700;text-transform:uppercase;letter-spacing:0.06em">Trocar de perfil</div>
        ${roles.map(r => `
          <div class="role-menu-item ${state.role === r.id ? 'active' : ''}" data-action="switch-role" data-role="${r.id}" data-screen="${r.screen}">
            <div style="display:flex;flex-direction:column;flex:1">
              <div>${r.label}</div>
              <div style="font-size:11px;color:var(--fg-3);font-weight:400">${r.desc}</div>
            </div>
            ${state.role === r.id ? icon('check', 16) : ''}
          </div>
        `).join('')}
        <div class="role-menu-divider"></div>
        <div class="role-menu-item" data-action="logout">${icon('log-out', 14)}<span>Sair</span></div>
      </div>
    `;
  }

  function navForRole(role) {
    if (role === 'cliente') return [
      { screen: 'catalog', label: 'Catálogo',    icon: 'layout-grid'   },
      { screen: 'cart',    label: 'Carrinho',     icon: 'shopping-cart' },
      { screen: 'orders',  label: 'Meus Pedidos', icon: 'package'       },
      { screen: 'profile', label: 'Meu Perfil',   icon: 'user-circle-2' },
    ];
    if (role === 'operador') return [
      { screen: 'queue',    label: 'Fila de Pedidos', icon: 'clipboard-list' },
      { screen: 'products', label: 'Painel de Produtos', icon: 'boxes' },
    ];
    if (role === 'admin') return [
      { screen: 'dashboard', label: 'Dashboard',   icon: 'bar-chart-3' },
      { screen: 'users',     label: 'Usuários',    icon: 'users' },
    ];
    return [];
  }

  function roleLabel(r) { return { cliente: 'Cliente', operador: 'Operador', admin: 'Administrador' }[r] || ''; }

  // -----------------------------------------------------------
  // CATALOG
  // -----------------------------------------------------------
  function renderCatalog() {
    const { search, category, priceMin, priceMax } = state.catalog;
    let prods = state.products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (priceMin && p.price < parseFloat(priceMin)) return false;
      if (priceMax && p.price > parseFloat(priceMax)) return false;
      return true;
    });
    const catCounts = CATEGORIES.map(c => ({ name: c, n: state.products.filter(p => p.category === c).length }));
    return `
      <div class="page-head">
        <div>
          <h1>Catálogo</h1>
          <div class="sub">Bom dia, ${esc((state.user?.name || 'cliente').split(' ')[0])} · ${state.products.length} produtos em ${CATEGORIES.length} categorias</div>
        </div>
      </div>
      <div class="catalog-layout">
        <aside class="filters">
          <div class="filter-block">
            <h4>Categorias</h4>
            <div class="category-list">
              <div class="cat-item ${!category ? 'active' : ''}" data-action="filter-cat" data-cat="">
                <span>Todas</span><span class="n">${state.products.length}</span>
              </div>
              ${catCounts.map(c => `
                <div class="cat-item ${category === c.name ? 'active' : ''}" data-action="filter-cat" data-cat="${esc(c.name)}">
                  <span>${esc(c.name)}</span><span class="n">${c.n}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="filter-block">
            <h4>Faixa de preço</h4>
            <div class="price-range">
              <span>R$</span>
              <input type="number" placeholder="0" value="${esc(priceMin)}" data-action="filter-pricemin" min="0">
              <span>—</span>
              <input type="number" placeholder="100" value="${esc(priceMax)}" data-action="filter-pricemax" min="0">
            </div>
          </div>
        </aside>
        <div>
          <div class="catalog-toolbar">
            <div class="input-icon">
              ${icon('search', 16)}
              <input class="input" type="search" placeholder="Buscar por nome…" value="${esc(search)}" data-action="catalog-search">
            </div>
          </div>
          ${prods.length === 0 ? `
            <div class="empty-state">
              ${icon('search-x', 36)}
              <h3>Nenhum produto encontrado</h3>
              <p>Tente outra busca ou ajuste os filtros.</p>
            </div>
          ` : `
            <div class="product-grid">${prods.map(productCard).join('')}</div>
          `}
        </div>
      </div>
    `;
  }

  function productCard(p) {
    const stockLabel = p.stock === 0 ? 'Sem estoque' : p.stock < 5 ? `Restam ${p.stock} un.` : `${p.stock} un. em estoque`;
    const stockCls = p.stock === 0 ? 'out' : p.stock < 5 ? 'low' : '';
    return `
      <div class="pcard" data-action="open-product" data-id="${p.id}">
        <div class="pcard-img">
          <img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
          ${p.stock === 0 ? '<div class="out">Indisponível</div>' : ''}
        </div>
        <div class="pcard-body">
          <div class="pcard-category">${esc(p.category)}</div>
          <div class="pcard-name">${esc(p.name)} <span style="color:var(--fg-3);font-weight:400">${esc(p.size)}</span></div>
          <div class="pcard-price num">${money(p.price)}</div>
          <div class="pcard-stock ${stockCls}">${stockLabel}</div>
          <div class="pcard-add">
            ${p.stock > 0
              ? `<button class="btn btn-primary btn-sm btn-block" data-action="add-to-cart" data-id="${p.id}" data-stop="1">Adicionar</button>`
              : `<button class="btn btn-secondary btn-sm btn-block" disabled>Indisponível</button>`}
          </div>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // PRODUCT DETAIL
  // -----------------------------------------------------------
  function renderProductDetail() {
    const p = productById(state.selectedProductId);
    if (!p) return '<div>Produto não encontrado</div>';
    return `
      <a href="#" data-action="nav" data-screen="catalog" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--fg-2);margin-bottom:16px">
        ${icon('arrow-left', 14)} Voltar ao catálogo
      </a>
      <div class="detail-layout">
        <div class="detail-img"><img src="${esc(p.img)}" alt="${esc(p.name)}"></div>
        <div class="detail-info">
          <div class="cat">${esc(p.category)}</div>
          <h2>${esc(p.name)}</h2>
          <div style="color:var(--fg-3);font-size:14px">${esc(p.size)} · EAN <span class="mono">${esc(p.ean)}</span></div>
          <div class="detail-price num">${money(p.price)}</div>
          <p class="desc">${esc(p.desc)}</p>
          ${p.stock > 0 ? `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
              <div class="qty-stepper">
                <button data-action="qty-dec">−</button>
                <input type="text" value="1" id="qty-input" data-action="qty-input">
                <button data-action="qty-inc">+</button>
              </div>
              <button class="btn btn-primary" data-action="add-to-cart-qty" data-id="${p.id}" style="height:40px;padding:0 24px">
                ${icon('shopping-cart', 16)} Adicionar ao Carrinho
              </button>
            </div>
            <div style="font-size:12px;color:var(--green-700);font-weight:500">${icon('check-circle-2', 14)} ${p.stock} unidades disponíveis na sua região</div>
          ` : `
            <button class="btn btn-secondary" disabled>Indisponível</button>
            <div style="font-size:12px;color:var(--red-700);margin-top:8px">${icon('x', 14)} Produto sem estoque no momento</div>
          `}
          ${p.nutri ? `
            <div class="nutri">
              <h5>Informações nutricionais — porção de ${esc(p.nutri.porção)}</h5>
              <div class="nutri-grid">
                ${Object.entries(p.nutri).filter(([k]) => k !== 'porção').map(([k, v]) => `
                  <div class="row"><span>${esc(k.charAt(0).toUpperCase() + k.slice(1))}</span><span class="v">${esc(v)}</span></div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // CART
  // -----------------------------------------------------------
  function renderCart() {
    if (state.cart.length === 0) {
      return `
        <div class="empty-state card" style="padding:80px 24px">
          ${icon('shopping-cart', 42)}
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos para continuar.</p>
          <button class="btn btn-primary" data-action="nav" data-screen="catalog" style="margin-top:16px">Ver catálogo</button>
        </div>
      `;
    }
    return `
      <div class="page-head"><h1>Carrinho <span style="color:var(--fg-3);font-weight:500">(${state.cart.length} ${state.cart.length === 1 ? 'item' : 'itens'})</span></h1></div>
      <div class="cart-layout">
        <div class="cart-list">
          ${state.cart.map(line => {
            const p = productById(line.productId);
            return `
              <div class="cart-row">
                <div class="thumb"><img src="${esc(p.img)}" alt=""></div>
                <div class="info">
                  <div class="name">${esc(p.name)} <span style="color:var(--fg-3);font-weight:400">${esc(p.size)}</span></div>
                  <div class="price">${money(p.price)} × ${line.qty}</div>
                  <div style="margin-top:8px"><div class="qty-stepper" style="height:30px">
                    <button data-action="cart-dec" data-id="${p.id}" style="height:30px;width:28px">−</button>
                    <input type="text" value="${line.qty}" readonly style="height:30px;width:36px">
                    <button data-action="cart-inc" data-id="${p.id}" style="height:30px;width:28px">+</button>
                  </div></div>
                </div>
                <div class="line-total num">${money(p.price * line.qty)}</div>
                <button class="remove" data-action="cart-remove" data-id="${p.id}" aria-label="Remover">${icon('trash-2', 18)}</button>
              </div>
            `;
          }).join('')}
        </div>
        <aside class="cart-summary">
          <h4>Resumo do pedido</h4>
          <div class="coupon-row">
            <input class="input" placeholder="Código de cupom" value="${esc(state.coupon || '')}" data-action="coupon-input" id="coupon-input">
            <button class="btn btn-secondary btn-sm" data-action="apply-coupon">Aplicar</button>
          </div>
          <div class="sum-row"><span>Subtotal</span><span class="v num">${money(cartSubtotal())}</span></div>
          ${state.coupon === 'PROMO10' ? `<div class="sum-row"><span>Cupom <span class="mono" style="font-size:11px;color:var(--fg-3)">PROMO10</span></span><span class="v num discount">− ${money(cartDiscount())}</span></div>` : ''}
          <div class="sum-row"><span>Entrega</span><span class="v num">${money(deliveryFee())}</span></div>
          <div class="sum-row total"><span>Total</span><span class="v num">${money(cartTotal())}</span></div>
          <button class="btn btn-primary btn-block" data-action="nav" data-screen="checkout" style="margin-top:16px;height:44px">
            Finalizar Compra ${icon('arrow-right', 16)}
          </button>
        </aside>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // CHECKOUT
  // -----------------------------------------------------------
  function renderCheckout() {
    if (state.cart.length === 0) {
      return `<div class="empty-state card" style="padding:60px 24px">${icon('shopping-cart', 36)}<h3>Carrinho vazio</h3><button class="btn btn-primary" data-action="nav" data-screen="catalog" style="margin-top:12px">Ver catálogo</button></div>`;
    }
    return `
      <div class="page-head"><h1>Checkout</h1></div>
      <div class="checkout-layout">
        <div>
          <div class="checkout-section">
            <h3>1. Como você quer receber?</h3>
            <div class="sub">Escolha entrega em casa ou retirada na loja.</div>
            <div class="radio-card-group">
              <div class="radio-card ${state.deliveryMode === 'delivery' ? 'selected' : ''}" data-action="set-delivery" data-mode="delivery">
                <div class="title">${icon('truck', 18)} Entrega</div>
                <div class="desc">Em casa, até 60 min. R$ 8,90.</div>
              </div>
              <div class="radio-card ${state.deliveryMode === 'pickup' ? 'selected' : ''}" data-action="set-delivery" data-mode="pickup">
                <div class="title">${icon('store', 18)} Retirada na loja</div>
                <div class="desc">Pronto em 30 min. Sem custo.</div>
              </div>
            </div>
          </div>
          ${state.deliveryMode === 'delivery' ? `
            <div class="checkout-section">
              <h3>2. Endereço de entrega</h3>
              <div class="sub">Informe o CEP e os dados de entrega.</div>
              <div style="display:grid;grid-template-columns:160px 1fr;gap:12px">
                <div class="field" style="margin:0"><label class="field-label">CEP</label><input class="input" placeholder="00000-000" value="04567-000"></div>
                <div class="field" style="margin:0"><label class="field-label">Endereço</label><input class="input" value="Rua das Palmeiras, 240" readonly></div>
                <div class="field" style="margin:0"><label class="field-label">Bairro</label><input class="input" value="Vila Mariana" readonly></div>
                <div class="field" style="margin:0"><label class="field-label">Cidade / UF</label><input class="input" value="São Paulo / SP" readonly></div>
              </div>
              <div class="field" style="margin:12px 0 0"><label class="field-label">Complemento (opcional)</label><input class="input" placeholder="apto, bloco…"></div>
            </div>
          ` : ''}
          <div class="checkout-section">
            <h3>${state.deliveryMode === 'delivery' ? '3' : '2'}. Forma de pagamento</h3>
            <div class="sub">Cartão de crédito ou Pix.</div>
            <div class="radio-card-group">
              <div class="radio-card ${state.paymentMode === 'card' ? 'selected' : ''}" data-action="set-payment" data-mode="card">
                <div class="title">${icon('credit-card', 18)} Cartão de Crédito</div>
                <div class="desc">Visa, Master, Elo. Em até 3x sem juros.</div>
              </div>
              <div class="radio-card ${state.paymentMode === 'pix' ? 'selected' : ''}" data-action="set-payment" data-mode="pix">
                <div class="title">${icon('qr-code', 18)} Pix</div>
                <div class="desc">Aprovação instantânea.</div>
              </div>
            </div>
            ${state.paymentMode === 'card' ? `
              <div style="margin-top:14px;display:grid;grid-template-columns:1fr 120px 100px;gap:12px">
                <div class="field" style="margin:0"><label class="field-label">Número do cartão</label><input class="input" placeholder="0000 0000 0000 0000"></div>
                <div class="field" style="margin:0"><label class="field-label">Validade</label><input class="input" placeholder="MM/AA"></div>
                <div class="field" style="margin:0"><label class="field-label">CVV</label><input class="input" placeholder="123"></div>
              </div>
            ` : `
              <div class="pix-qr">
                <div class="pix-qr-code">${pixQrSvg()}</div>
                <div class="pix-info">
                  <div style="font-weight:600;margin-bottom:4px">Escaneie o QR Code</div>
                  <div style="font-size:13px;color:var(--fg-2)">Ou copie o código:</div>
                  <div class="code">00020126580014BR.GOV.BCB.PIX01361234</div>
                </div>
              </div>
            `}
          </div>
        </div>
        <aside class="cart-summary">
          <h4>Resumo</h4>
          ${state.cart.map(l => {
            const p = productById(l.productId);
            return `<div class="sum-row"><span style="font-size:13px">${esc(p.name)} × ${l.qty}</span><span class="v num">${money(p.price * l.qty)}</span></div>`;
          }).join('')}
          <div style="height:1px;background:var(--border-1);margin:10px 0"></div>
          <div class="sum-row"><span>Subtotal</span><span class="v num">${money(cartSubtotal())}</span></div>
          ${state.coupon === 'PROMO10' ? `<div class="sum-row"><span>Cupom</span><span class="v num discount">− ${money(cartDiscount())}</span></div>` : ''}
          <div class="sum-row"><span>Entrega</span><span class="v num">${money(deliveryFee())}</span></div>
          <div class="sum-row total"><span>Total</span><span class="v num">${money(cartTotal())}</span></div>
          <button class="btn btn-primary btn-block" data-action="confirm-order" style="margin-top:16px;height:44px">Confirmar Pedido</button>
        </aside>
      </div>
    `;
  }

  function pixQrSvg() {
    // Pseudo-QR pattern, decorative only
    let cells = '';
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      if (((x * 17 + y * 31 + x*y) % 7) < 3 || (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)) {
        cells += `<rect x="${x*5}" y="${y*5}" width="5" height="5" fill="#18181B"/>`;
      }
    }
    return `<svg viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg">${cells}<rect x="0" y="0" width="35" height="35" fill="none" stroke="#fff" stroke-width="5"/><rect x="5" y="5" width="25" height="25" fill="none" stroke="#18181B" stroke-width="5"/><rect x="10" y="10" width="15" height="15" fill="#18181B"/><rect x="70" y="0" width="35" height="35" fill="none" stroke="#fff" stroke-width="5"/><rect x="75" y="5" width="25" height="25" fill="none" stroke="#18181B" stroke-width="5"/><rect x="80" y="10" width="15" height="15" fill="#18181B"/><rect x="0" y="70" width="35" height="35" fill="none" stroke="#fff" stroke-width="5"/><rect x="5" y="75" width="25" height="25" fill="none" stroke="#18181B" stroke-width="5"/><rect x="10" y="80" width="15" height="15" fill="#18181B"/></svg>`;
  }

  function renderConfirmation() {
    const o = state.confirmedOrder;
    return `
      <div class="card confirm-card">
        <div class="check">${icon('check', 32)}</div>
        <h2>Pedido confirmado!</h2>
        <div style="color:var(--fg-2);margin-bottom:18px">Já estamos separando seus itens. Acompanhe pelo Meus Pedidos.</div>
        <div style="background:var(--surface-1);border-radius:var(--radius-md);padding:14px 18px;margin:16px 0;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--fg-2)">Número</span><span class="mono" style="font-weight:600">#${o.id}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:6px"><span style="color:var(--fg-2)">Total</span><span class="num" style="font-weight:600">${money(o.total)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:6px"><span style="color:var(--fg-2)">Entrega</span><span>${o.deliveryMode === 'delivery' ? 'Até 60 min' : 'Retirar na loja'}</span></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="btn btn-secondary" data-action="nav" data-screen="catalog">Continuar comprando</button>
          <button class="btn btn-primary" data-action="nav" data-screen="orders">Ver meus pedidos</button>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // ORDERS (cliente)
  // -----------------------------------------------------------
  function renderOrders() {
    const STATUS_ORDER = ['confirmado', 'separando', 'transporte', 'entregue'];
    const STATUS_LABELS = { confirmado: 'Confirmado', separando: 'Separando', transporte: 'Em Transporte', entregue: 'Entregue', cancelado: 'Cancelado' };
    return `
      <div class="page-head"><h1>Meus Pedidos</h1><div class="sub">${state.orders.length} pedidos no histórico</div></div>
      <div class="order-list">
        ${state.orders.map(o => {
          const cancelled = o.status === 'cancelado';
          const idx = STATUS_ORDER.indexOf(o.status);
          return `
            <div class="order-card">
              <div class="order-head">
                <div>
                  <div style="font-weight:700;font-size:15px">Pedido <span class="order-id">#${esc(o.id)}</span></div>
                  <div class="order-meta">${o.items} ${o.items === 1 ? 'item' : 'itens'} · ${esc(o.createdAt)}</div>
                </div>
                <div style="text-align:right">
                  <span class="badge badge-${o.status}"><span class="dot"></span>${STATUS_LABELS[o.status]}</span>
                  <div class="order-total num" style="margin-top:6px">${money(o.total)}</div>
                </div>
              </div>
              <div class="progress-bar">
                ${STATUS_ORDER.map((s, i) => {
                  let cls = '';
                  if (cancelled) cls = i === 0 ? 'cancelled' : '';
                  else if (i < idx) cls = 'done';
                  else if (i === idx) cls = 'active';
                  return `<div class="progress-step ${cls}"><div class="bar"></div><div class="label">${STATUS_LABELS[s]}</div></div>`;
                }).join('')}
              </div>
              <div style="font-size:13px;color:var(--fg-2);margin-bottom:10px">${esc(o.products.join(' · '))}</div>
              <div class="order-foot">
                <button class="btn btn-ghost btn-sm" data-action="track" data-id="${esc(o.id)}">${icon('map-pin', 14)} Acompanhar</button>
                ${(o.status === 'confirmado' || o.status === 'separando') ? `<button class="btn btn-secondary btn-sm" data-action="cancel-order" data-id="${esc(o.id)}">Cancelar pedido</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // -----------------------------------------------------------
  // OPERADOR — Products panel
  // -----------------------------------------------------------
  function renderProductsPanel() {
    const q = state.productSearch.toLowerCase().trim();
    const rows = state.products.filter(p => !q || p.name.toLowerCase().includes(q) || p.ean.includes(q));
    return `
      <div class="page-head">
        <div><h1>Painel de Produtos</h1><div class="sub">${state.products.length} produtos cadastrados</div></div>
        <button class="btn btn-primary" data-action="new-product">${icon('plus', 16)} Cadastrar Produto</button>
      </div>
      <div style="margin-bottom:16px;max-width:380px">
        <div class="input-icon">
          ${icon('search', 16)}
          <input class="input" placeholder="Buscar por nome ou EAN…" value="${esc(state.productSearch)}" data-action="product-search">
        </div>
      </div>
      <div class="data-table">
        <table>
          <thead><tr><th>Produto</th><th>EAN</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
          <tbody>
            ${rows.map(p => `
              <tr>
                <td><div style="font-weight:500">${esc(p.name)}</div><div style="font-size:11px;color:var(--fg-3)">${esc(p.size)}</div></td>
                <td class="ean">${esc(p.ean)}</td>
                <td><span style="font-size:12px;color:var(--fg-2)">${esc(p.category)}</span></td>
                <td class="price">${money(p.price)}</td>
                <td><span class="num" style="font-weight:600">${p.stock}</span> <span style="color:var(--fg-3);font-size:12px">un.</span></td>
                <td><span class="pill-status ${p.stock > 0 ? 'on' : 'off'}"><span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>${p.stock > 0 ? 'Ativo' : 'Inativo'}</span></td>
                <td><div class="actions">
                  <button class="btn btn-secondary" data-action="edit-price" data-id="${p.id}">Preço</button>
                  <button class="btn btn-secondary" data-action="edit-stock" data-id="${p.id}">Estoque</button>
                  <button class="btn btn-ghost" data-action="toggle-product" data-id="${p.id}">${p.stock > 0 ? 'Desativar' : 'Ativar'}</button>
                </div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // OPERADOR — Queue (Kanban)
  // -----------------------------------------------------------
  function renderQueue() {
    const cols = [
      { id: 'aguardando', label: 'Aguardando', icon: 'clock' },
      { id: 'separando',  label: 'Separando',  icon: 'package' },
      { id: 'pronto',     label: 'Pronto',     icon: 'check-circle-2' },
    ];
    return `
      <div class="page-head">
        <div><h1>Fila de Pedidos</h1><div class="sub">${state.queue.length} pedidos na operação · ${state.queue.filter(o => o.late).length} atrasados</div></div>
      </div>
      <div class="kanban">
        ${cols.map(col => {
          const items = state.queue.filter(o => o.status === col.id);
          return `
            <div class="kanban-col">
              <div class="kanban-head">
                <div class="name">${icon(col.icon, 14)} ${col.label}</div>
                <div class="count">${items.length}</div>
              </div>
              ${items.length === 0 ? `<div style="padding:24px 12px;text-align:center;color:var(--fg-3);font-size:12px">Sem pedidos</div>` : items.map(o => `
                <div class="kanban-card ${o.intervened ? 'intervened' : o.late ? 'late' : ''}">
                  <div class="row1">
                    <span class="id">#${esc(o.id)}</span>
                    <span class="time">${o.intervened ? '✓ Intervido' : o.late ? `⚠ ${o.minutesAgo} min` : `${o.minutesAgo} min`}</span>
                  </div>
                  <div class="customer">${esc(o.customer)}</div>
                  <div class="items">${o.items} ${o.items === 1 ? 'item' : 'itens'} · ${money(o.total)}</div>
                  <div class="actions">
                    <button class="btn btn-secondary" data-action="print-comanda" data-id="${esc(o.id)}">${icon('printer', 14)} Imprimir</button>
                    ${o.late && !o.intervened ? `<button class="btn btn-danger" data-action="intervene-order" data-id="${esc(o.id)}">${icon('alert-triangle', 13)} Intervir</button>` : ''}
                    ${col.id !== 'pronto' ? `<button class="btn btn-primary" data-action="advance-order" data-id="${esc(o.id)}">${col.id === 'aguardando' ? 'Iniciar' : 'Pronto'}</button>` : `<button class="btn btn-primary" data-action="dispatch-order" data-id="${esc(o.id)}">Despachar</button>`}
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // -----------------------------------------------------------
  // ADMIN — Users
  // -----------------------------------------------------------
  function renderUsers() {
    return `
      <div class="page-head">
        <div><h1>Gerenciar Usuários</h1><div class="sub">${state.users.filter(u => u.role === 'cliente').length} clientes · ${state.users.filter(u => u.role === 'operador').length} operadores</div></div>
        <button class="btn btn-primary" data-action="new-operator">${icon('user-plus', 16)} Cadastrar Operador</button>
      </div>
      <div class="data-table">
        <table>
          <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Cadastrado em</th><th>Pedidos</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
          <tbody>
            ${state.users.map(u => `
              <tr>
                <td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary-50);color:var(--primary-700);display:grid;place-items:center;font-weight:700;font-size:13px">${u.name.charAt(0)}</div><span style="font-weight:500">${esc(u.name)}</span></div></td>
                <td class="ean">${esc(u.email)}</td>
                <td><span class="badge badge-confirmado" style="background:var(--surface-2);color:var(--fg-1)">${roleLabel(u.role)}</span></td>
                <td style="color:var(--fg-2);font-size:13px">${esc(u.joined)}</td>
                <td class="num">${u.orders}</td>
                <td><span class="pill-status ${u.active ? 'on' : 'off'}"><span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>${u.active ? 'Ativo' : 'Inativo'}</span></td>
                <td><div class="actions">
                  ${u.role !== 'cliente' ? `<button class="btn btn-secondary" data-action="set-perms" data-id="${u.id}">Permissões</button>` : ''}
                  <button class="btn btn-ghost" data-action="remove-user" data-id="${u.id}">Remover</button>
                </div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // ADMIN — Dashboard
  // -----------------------------------------------------------
  function renderDashboard() {
    const max = Math.max(...SALES_BY_DAY.map(d => d.value));
    return `
      <div class="page-head">
        <div><h1>Dashboard</h1><div class="sub">Resumo dos últimos 7 dias</div></div>
        <button class="btn btn-secondary">${icon('calendar', 14)} 22–28 mai 2026</button>
      </div>
      <div class="kpi-grid">
        <div class="kpi">
          <div class="label">Receita do mês</div>
          <div class="value">${money(184320)}</div>
          <div class="delta up">${icon('trending-up', 12)} 12,4% vs. mês anterior</div>
        </div>
        <div class="kpi">
          <div class="label">Pedidos ativos</div>
          <div class="value">47</div>
          <div class="delta down">${icon('trending-down', 12)} 3 vs. ontem</div>
        </div>
        <div class="kpi">
          <div class="label">Clientes ativos</div>
          <div class="value">1.284</div>
          <div class="delta up">${icon('trending-up', 12)} 38 novos esta semana</div>
        </div>
      </div>
      <div class="dash-grid">
        <div class="chart-card">
          <h4>Vendas por dia</h4>
          <div class="bar-chart">
            ${SALES_BY_DAY.map(d => `
              <div class="bar" style="height:${(d.value / max * 100).toFixed(0)}%"><span class="v">${(d.value/1000).toFixed(1)}k</span></div>
            `).join('')}
          </div>
          <div class="bar-labels">${SALES_BY_DAY.map(d => `<span>${esc(d.day)} mai</span>`).join('')}</div>
        </div>
        <div class="chart-card">
          <h4>Top 5 Produtos</h4>
          <div class="top-list">
            ${TOP_PRODUCTS.map((t, i) => {
              const p = productById(t.productId);
              return `
                <div class="top-item">
                  <div class="rank">#${i + 1}</div>
                  <div class="thumb"><img src="${esc(p.img)}" alt=""></div>
                  <div><div class="name">${esc(p.name)}</div><div class="meta">${esc(p.category)} · ${money(p.price)}</div></div>
                  <div class="qty">${t.sold}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // MODAL
  // -----------------------------------------------------------
  function renderModal() {
    const root = $('#modal-root');
    if (!state.modal) { root.innerHTML = ''; return; }
    const { type, payload } = state.modal;
    let html = '';
    if (type === 'cancel-order') {
      html = `<h3>Cancelar pedido?</h3><p class="sub">O pedido <span class="mono">#${esc(payload.id)}</span> será cancelado. Essa ação não pode ser desfeita.</p>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Voltar</button><button class="btn btn-danger" data-action="confirm-cancel-order" data-id="${esc(payload.id)}">Cancelar pedido</button></div>`;
    } else if (type === 'edit-price') {
      const p = productById(payload.id);
      html = `<h3>Editar preço — ${esc(p.name)}</h3><p class="sub">Preço atual: ${money(p.price)}</p>
        <div class="field"><label class="field-label">Novo preço (R$)</label><input class="input" type="number" step="0.01" value="${p.price}" id="modal-price-input"></div>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-price" data-id="${p.id}">Salvar</button></div>`;
    } else if (type === 'edit-stock') {
      const p = productById(payload.id);
      html = `<h3>Atualizar estoque — ${esc(p.name)}</h3><p class="sub">Estoque atual: ${p.stock} unidades</p>
        <div class="field"><label class="field-label">Novo estoque</label><input class="input" type="number" value="${p.stock}" id="modal-stock-input"></div>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-stock" data-id="${p.id}">Salvar</button></div>`;
    } else if (type === 'remove-user') {
      const u = state.users.find(x => x.id === payload.id);
      html = `<h3>Remover ${esc(u.name)}?</h3><p class="sub">O usuário será marcado como inativo (soft delete). Você poderá restaurá-lo depois.</p>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Voltar</button><button class="btn btn-danger" data-action="confirm-remove-user" data-id="${u.id}">Remover</button></div>`;
    } else if (type === 'print-comanda') {
      const o = state.queue.find(x => x.id === payload.id);
      html = `<h3>${icon('printer', 18)} Comanda #${esc(o.id)}</h3><p class="sub">Cliente: ${esc(o.customer)} · ${o.items} itens · ${money(o.total)}</p>
        <div style="background:var(--surface-1);padding:14px;border-radius:var(--radius-md);font-family:var(--font-mono);font-size:12px;line-height:1.7">
          MARKETECH — COMANDA<br>#${esc(o.id)} · ${esc(o.customer)}<br>${o.minutesAgo} min · ${money(o.total)}<br>--------------------<br>${o.items} itens p/ separar
        </div>
        <div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Comanda impressa</button></div>`;
    } else if (type === 'new-product') {
      html = `
        <h3>${icon('package-plus', 18)} Cadastrar Produto</h3>
        <p class="sub">Novo item criado com estoque 0 (inativo) por padrão.</p>
        <div class="err" id="np-err" style="display:none;margin-bottom:12px"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field" style="grid-column:1/-1">
            <label class="field-label">Nome do produto *</label>
            <input class="input" id="np-name" placeholder="ex: Arroz Branco Tipo 1">
          </div>
          <div class="field">
            <label class="field-label">EAN</label>
            <input class="input" id="np-ean" maxlength="13" placeholder="7891000…">
          </div>
          <div class="field">
            <label class="field-label">Categoria *</label>
            <select class="input" id="np-cat">
              ${CATEGORIES.map(c => `<option>${esc(c)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label">Tamanho / Unidade</label>
            <input class="input" id="np-size" placeholder="ex: 500 g, un., kg">
          </div>
          <div class="field">
            <label class="field-label">Preço (R$) *</label>
            <input class="input" type="number" step="0.01" min="0.01" id="np-price" placeholder="0,00">
          </div>
        </div>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-new-product">Cadastrar</button></div>`;
    } else if (type === 'new-operator') {
      html = `
        <h3>${icon('user-plus', 18)} Cadastrar Operador</h3>
        <p class="sub">O operador acessa as áreas conforme as permissões definidas abaixo.</p>
        <div class="err" id="no-err" style="display:none;margin-bottom:12px"></div>
        <div class="field">
          <label class="field-label">Nome completo *</label>
          <input class="input" id="no-name" placeholder="Nome do operador">
        </div>
        <div class="field">
          <label class="field-label">E-mail *</label>
          <input class="input" type="email" id="no-email" placeholder="operador@empresa.com">
        </div>
        <div class="field">
          <label class="field-label" style="margin-bottom:10px">Permissões</label>
          <div style="display:flex;gap:20px">
            <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer">
              <input type="checkbox" id="no-perm-estoque" checked style="accent-color:var(--primary-500);width:16px;height:16px"> Painel de Produtos
            </label>
            <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer">
              <input type="checkbox" id="no-perm-fila" checked style="accent-color:var(--primary-500);width:16px;height:16px"> Fila de Pedidos
            </label>
          </div>
        </div>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-new-operator">Cadastrar</button></div>`;
    } else if (type === 'intervene-order') {
      const o = state.queue.find(x => x.id === payload.id);
      html = `
        <h3>${icon('alert-triangle', 18)} Intervir no Pedido</h3>
        <div style="background:var(--red-50);border:1px solid var(--red-100);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:16px;display:flex;align-items:flex-start;gap:10px">
          <div style="color:var(--red-600);flex-shrink:0;margin-top:2px">${icon('clock', 16)}</div>
          <div>
            <div style="font-weight:700;color:var(--red-700);margin-bottom:3px">Pedido em atraso — ${o.minutesAgo} min</div>
            <div style="font-size:13px"><span class="mono">#${esc(o.id)}</span> · ${esc(o.customer)} · ${o.items} ${o.items === 1 ? 'item' : 'itens'} · ${money(o.total)}</div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Justificativa *</label>
          <textarea class="textarea" id="modal-intervention-text" rows="4" placeholder="Descreva o motivo da intervenção e as ações tomadas…"></textarea>
        </div>
        <div class="err" id="iv-err" style="display:none;margin-top:8px"></div>
        <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-danger" data-action="save-intervention" data-id="${esc(o.id)}">Registrar Intervenção</button></div>`;
    }
    root.innerHTML = `<div class="modal-backdrop" data-action="close-modal-bg"><div class="modal">${html}</div></div>`;
    refreshIcons();
  }

  // -----------------------------------------------------------
  // EVENT HANDLERS
  // -----------------------------------------------------------
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) {
      if (state.roleMenuOpen) { state.roleMenuOpen = false; render(); }
      return;
    }
    const a = t.dataset.action;
    const id = t.dataset.id;

    if (a === 'submit-login') return;
    if (a === 'forgot') { e.preventDefault(); state.screen = 'password-recovery'; render(); return; }
    if (a === 'signup') { e.preventDefault(); state.screen = 'signup'; render(); return; }

    if (a === 'nav') { e.preventDefault(); state.screen = t.dataset.screen; state.roleMenuOpen = false; render(); return; }
    if (a === 'toggle-role-menu') { e.stopPropagation(); state.roleMenuOpen = !state.roleMenuOpen; render(); return; }
    if (a === 'switch-role') {
      state.role = t.dataset.role; state.screen = t.dataset.screen; state.roleMenuOpen = false;
      toast(`Perfil alterado para ${roleLabel(state.role)}.`, { type: 'info' });
      render(); return;
    }
    if (a === 'logout') { state.user = null; state.role = null; state.screen = 'login'; state.roleMenuOpen = false; render(); return; }
    if (a === 'onboarding-skip') { state.screen = 'login'; render(); return; }
    if (a === 'onboarding-next') { state.onboardingSlide++; render(); return; }
    if (a === 'onboarding-goto-signup') { state.screen = 'signup'; render(); return; }
    if (a === 'back-to-login') { e.preventDefault(); state.recoveryEmailSent = false; state.screen = 'login'; render(); return; }
    if (a === 'add-address') { toast('Gerenciamento de endereços em breve.', { type: 'info' }); return; }

    // Catalog
    if (a === 'filter-cat') { state.catalog.category = t.dataset.cat || null; render(); return; }
    if (a === 'open-product') { state.selectedProductId = id; state.screen = 'product'; render(); return; }
    if (a === 'add-to-cart') { e.stopPropagation(); addToCart(id, 1); return; }
    if (a === 'add-to-cart-qty') { const q = parseInt(document.getElementById('qty-input').value, 10) || 1; addToCart(id, q); return; }
    if (a === 'qty-inc') { const i = document.getElementById('qty-input'); i.value = (parseInt(i.value, 10) || 1) + 1; return; }
    if (a === 'qty-dec') { const i = document.getElementById('qty-input'); i.value = Math.max(1, (parseInt(i.value, 10) || 1) - 1); return; }

    // Cart
    if (a === 'cart-inc') { const line = state.cart.find(l => l.productId === id); if (line) line.qty++; render(); return; }
    if (a === 'cart-dec') {
      const idx = state.cart.findIndex(l => l.productId === id);
      if (idx >= 0) { state.cart[idx].qty--; if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1); }
      render(); return;
    }
    if (a === 'cart-remove') { removeFromCart(id); return; }
    if (a === 'apply-coupon') { applyCoupon(); return; }

    // Checkout
    if (a === 'set-delivery') { state.deliveryMode = t.dataset.mode; render(); return; }
    if (a === 'set-payment') { state.paymentMode = t.dataset.mode; render(); return; }
    if (a === 'confirm-order') { confirmOrder(); return; }

    // Orders
    if (a === 'cancel-order') { state.modal = { type: 'cancel-order', payload: { id } }; render(); return; }
    if (a === 'confirm-cancel-order') {
      const o = state.orders.find(x => x.id === id); if (o) o.status = 'cancelado';
      state.modal = null; toast(`Pedido #${id} cancelado.`, { type: 'warn' }); render(); return;
    }
    if (a === 'track') { toast('Mapa de rastreamento em breve.', { type: 'info' }); return; }

    // Operador — Products
    if (a === 'new-product') { state.modal = { type: 'new-product', payload: {} }; render(); return; }
    if (a === 'save-new-product') {
      const name  = (document.getElementById('np-name')?.value || '').trim();
      const ean   = (document.getElementById('np-ean')?.value  || '').trim();
      const cat   = document.getElementById('np-cat')?.value   || CATEGORIES[0];
      const size  = (document.getElementById('np-size')?.value || '').trim();
      const price = parseFloat(document.getElementById('np-price')?.value);
      const err   = document.getElementById('np-err');
      if (!name)                      { err.textContent = 'Nome do produto é obrigatório.'; err.style.display = 'block'; return; }
      if (isNaN(price) || price <= 0) { err.textContent = 'Informe um preço válido maior que zero.'; err.style.display = 'block'; return; }
      const slug  = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newId = 'p' + (state.products.length + 1);
      state.products.push({ id: newId, ean: ean || `EAN-${newId}`, name, size, category: cat, price, stock: 0, img: `https://picsum.photos/seed/${slug}/400/400`, desc: '', nutri: null });
      state.modal = { type: 'edit-stock', payload: { id: newId } };
      toast(`"${name}" criado! Defina o estoque para ativar.`, { type: 'info' }); render(); return;
    }
    if (a === 'edit-price') { state.modal = { type: 'edit-price', payload: { id } }; render(); return; }
    if (a === 'edit-stock') { state.modal = { type: 'edit-stock', payload: { id } }; render(); return; }
    if (a === 'save-price') {
      const v = parseFloat(document.getElementById('modal-price-input').value);
      const p = productById(id); if (p && !isNaN(v) && v >= 0) p.price = v;
      state.modal = null; toast(`Preço atualizado para ${money(v)}.`); render(); return;
    }
    if (a === 'save-stock') {
      const v = parseInt(document.getElementById('modal-stock-input').value, 10);
      const p = productById(id); if (p && !isNaN(v) && v >= 0) p.stock = v;
      state.modal = null; toast(`Estoque atualizado para ${v} un.`); render(); return;
    }
    if (a === 'toggle-product') {
      const p = productById(id); if (p) p.stock = p.stock > 0 ? 0 : 10;
      toast(`${p.name} ${p.stock > 0 ? 'reativado' : 'desativado'}.`, { type: 'info' }); render(); return;
    }

    // Operador — Queue
    if (a === 'print-comanda') { state.modal = { type: 'print-comanda', payload: { id } }; render(); return; }
    if (a === 'intervene-order') { state.modal = { type: 'intervene-order', payload: { id } }; render(); return; }
    if (a === 'save-intervention') {
      const text = (document.getElementById('modal-intervention-text')?.value || '').trim();
      const err  = document.getElementById('iv-err');
      if (!text) { err.textContent = 'A justificativa é obrigatória.'; err.style.display = 'block'; return; }
      const o = state.queue.find(x => x.id === id);
      if (o) { o.intervened = true; o.late = false; o.interventionNote = text; }
      state.modal = null; toast(`Intervenção registrada no pedido #${id}.`, { type: 'warn' }); render(); return;
    }
    if (a === 'advance-order') {
      const o = state.queue.find(x => x.id === id);
      if (o) { o.status = o.status === 'aguardando' ? 'separando' : 'pronto'; o.minutesAgo = 0; o.late = false; }
      toast(`Pedido #${id} avançou para ${o.status}.`); render(); return;
    }
    if (a === 'dispatch-order') {
      state.queue = state.queue.filter(x => x.id !== id);
      toast(`Pedido #${id} despachado.`); render(); return;
    }

    // Admin — Users
    if (a === 'new-operator') { state.modal = { type: 'new-operator', payload: {} }; render(); return; }
    if (a === 'save-new-operator') {
      const name  = (document.getElementById('no-name')?.value  || '').trim();
      const email = (document.getElementById('no-email')?.value || '').trim().toLowerCase();
      const perms = [];
      if (document.getElementById('no-perm-estoque')?.checked) perms.push('estoque');
      if (document.getElementById('no-perm-fila')?.checked)    perms.push('fila');
      const err = document.getElementById('no-err');
      if (!name)                           { err.textContent = 'Nome é obrigatório.'; err.style.display = 'block'; return; }
      if (!email || !email.includes('@'))  { err.textContent = 'Informe um e-mail válido.'; err.style.display = 'block'; return; }
      if (state.users.find(u => u.email === email)) { err.textContent = 'Já existe um usuário com esse e-mail.'; err.style.display = 'block'; return; }
      const newId = 'u' + (state.users.length + 1);
      const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      state.users.push({ id: newId, name, email, role: 'operador', joined: today, orders: 0, active: true, perms });
      const landingScreen = perms.includes('fila') ? 'queue' : 'products';
      TEST_EMAILS[email] = { role: 'operador', screen: landingScreen };
      state.modal = null; toast(`Operador "${name}" cadastrado. Login: ${email} / senha123`); render(); return;
    }
    if (a === 'set-perms') { toast('Tela de permissões em breve.', { type: 'info' }); return; }
    if (a === 'remove-user') { state.modal = { type: 'remove-user', payload: { id } }; render(); return; }
    if (a === 'confirm-remove-user') {
      const u = state.users.find(x => x.id === id); if (u) u.active = false;
      state.modal = null; toast(`${u.name} removido (soft delete).`, { type: 'warn' }); render(); return;
    }

    // Modal
    if (a === 'close-modal') { state.modal = null; render(); return; }
    if (a === 'close-modal-bg') { if (e.target === t) { state.modal = null; render(); } return; }
  });

  // Form submit
  document.addEventListener('submit', (e) => {
    if (e.target.matches('[data-action="submit-login"]')) {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = (fd.get('email') || '').toString().trim().toLowerCase();
      const match = TEST_EMAILS[email];
      if (!match) { document.getElementById('login-err').style.display = 'block'; return; }
      state.user = { email, name: state.users.find(u => u.email === email)?.name || email.split('@')[0] };
      state.role = match.role;
      state.screen = match.screen;
      render();
    }
    if (e.target.matches('[data-action="submit-signup"]')) {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name     = (fd.get('name')     || '').toString().trim();
      const email    = (fd.get('email')    || '').toString().trim().toLowerCase();
      const cpf      = (fd.get('cpf')      || '').toString().trim();
      const password = (fd.get('password') || '').toString();
      const confirm  = (fd.get('confirm')  || '').toString();
      const err = document.getElementById('signup-err');
      const cpfClean = cpf.replace(/\D/g, '');
      if (password !== confirm) { err.textContent = 'As senhas não coincidem.'; err.style.display = 'block'; return; }
      if (cpfClean.length !== 11) { err.textContent = 'CPF inválido. Use o formato 000.000.000-00.'; err.style.display = 'block'; return; }
      if (state.users.find(u => u.email === email)) { err.textContent = 'Este e-mail já está cadastrado.'; err.style.display = 'block'; return; }
      const newUser = { id: 'u' + (state.users.length + 1), name, email, cpf, role: 'cliente', joined: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }), orders: 0, active: true };
      state.users.push(newUser);
      state.user = { email, name, cpf };
      state.role = 'cliente';
      state.screen = 'catalog';
      toast(`Bem-vindo(a), ${name.split(' ')[0]}!`);
      render();
    }
    if (e.target.matches('[data-action="submit-recovery"]')) {
      e.preventDefault();
      state.recoveryEmailSent = true;
      render();
    }
  });

  // Input handlers
  document.addEventListener('input', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    if (a === 'catalog-search') { state.catalog.search = t.value; rerenderCatalogProducts(); }
    if (a === 'filter-pricemin') { state.catalog.priceMin = t.value; rerenderCatalogProducts(); }
    if (a === 'filter-pricemax') { state.catalog.priceMax = t.value; rerenderCatalogProducts(); }
    if (a === 'product-search') { state.productSearch = t.value; render(); }
    if (a === 'coupon-input') { state.coupon = null; /* don't auto-apply */ }
    if (a === 'cpf-input') {
      let v = t.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9)      v = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6, 9) + '-' + v.slice(9);
      else if (v.length > 6) v = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6);
      else if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3);
      t.value = v;
    }
  });

  // Light update for catalog (avoid full re-render losing focus)
  function rerenderCatalogProducts() {
    if (state.screen !== 'catalog') return;
    // simple full re-render with focus restoration
    const active = document.activeElement;
    const selStart = active?.selectionStart;
    const dataAction = active?.dataset?.action;
    render();
    if (dataAction) {
      const el = document.querySelector(`[data-action="${dataAction}"]`);
      if (el) { el.focus(); if (selStart != null && el.setSelectionRange) try { el.setSelectionRange(selStart, selStart); } catch {} }
    }
  }

  // -----------------------------------------------------------
  // Cart actions
  // -----------------------------------------------------------
  function addToCart(productId, qty = 1) {
    const p = productById(productId); if (!p || p.stock === 0) return;
    const existing = state.cart.find(l => l.productId === productId);
    if (existing) existing.qty += qty; else state.cart.push({ productId, qty });
    toast(`${p.name} adicionado ao carrinho.`);
    render();
  }

  function removeFromCart(productId) {
    const idx = state.cart.findIndex(l => l.productId === productId);
    if (idx < 0) return;
    const snapshot = state.cart[idx];
    state.cart.splice(idx, 1);
    const p = productById(productId);
    render();
    toast(`${p.name} removido do carrinho.`, {
      type: 'info',
      duration: 5000,
      undo: () => { state.cart.push(snapshot); render(); toast('Item restaurado.'); }
    });
  }

  function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const code = (input?.value || '').trim().toUpperCase();
    if (code === 'PROMO10') {
      state.coupon = 'PROMO10';
      toast('Cupom PROMO10 aplicado — 10% de desconto.');
      render();
    } else if (code === '') {
      state.coupon = null;
      render();
    } else {
      toast('Cupom inválido.', { type: 'error' });
    }
  }

  function confirmOrder() {
    const id = 'MK-' + (1046 + Math.floor(Math.random() * 200)).toString();
    const total = cartTotal();
    state.confirmedOrder = { id, total, deliveryMode: state.deliveryMode };
    state.orders.unshift({
      id, customer: state.user?.name || 'Você', items: state.cart.length, total,
      status: 'separando', createdAt: 'agora', minutesAgo: 0,
      products: state.cart.map(l => productById(l.productId).name)
    });
    state.cart = [];
    state.coupon = null;
    state.screen = 'confirmation';
    toast('Pedido confirmado. Já estamos separando.', { type: 'success' });
    render();
  }

  // Close role menu on outside click is handled in main click listener (no-action branch)

  // -----------------------------------------------------------
  // Boot — honor URL hash for direct role/screen entry
  //   e.g.  Marketech.html#role=cliente&screen=catalog
  // -----------------------------------------------------------
  (function bootFromHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h) return;
    const params = Object.fromEntries(h.split('&').map(p => p.split('=').map(decodeURIComponent)));
    if (params.role && ['cliente','operador','admin'].includes(params.role)) {
      const u = USERS.find(x => x.role === params.role);
      state.user = { email: u?.email || params.role + '@test.com', name: u?.name || roleLabel(params.role) };
      state.role = params.role;
      const defaults = { cliente: 'catalog', operador: 'queue', admin: 'dashboard' };
      state.screen = params.screen || defaults[params.role];
    }
  })();
  render();
})();
