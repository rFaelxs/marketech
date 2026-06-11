/* ============================================================
 * Marketech — Mock Data
 * Produtos, pedidos, usuários. Sem API real.
 * ============================================================ */

const PRODUCTS = [
  {
    id: 'p1', ean: '7891000100103', name: 'Arroz Branco Tipo 1', size: '5 kg',
    category: 'Mercearia', price: 24.90, stock: 42,
    img: 'https://picsum.photos/seed/arroz/400/400',
    desc: 'Arroz branco tipo 1 selecionado, grãos íntegros e soltinhos no cozimento.',
    nutri: { porção: '50g', calorias: '180 kcal', carbo: '38 g', proteína: '4 g', gordura: '0,5 g', sódio: '1 mg' }
  },
  {
    id: 'p2', ean: '7891000200205', name: 'Feijão Carioca', size: '1 kg',
    category: 'Mercearia', price: 8.49, stock: 18,
    img: 'https://picsum.photos/seed/feijao/400/400',
    desc: 'Feijão carioca tipo 1, novo safra, cozimento rápido.',
    nutri: { porção: '60g', calorias: '210 kcal', carbo: '36 g', proteína: '14 g', gordura: '1 g', sódio: '2 mg' }
  },
  {
    id: 'p3', ean: '7891000300307', name: 'Leite Integral', size: '1 L',
    category: 'Laticínios', price: 5.29, stock: 0,
    img: 'https://picsum.photos/seed/leite/400/400',
    desc: 'Leite UHT integral, embalagem longa vida.',
    nutri: { porção: '200ml', calorias: '124 kcal', carbo: '9 g', proteína: '6 g', gordura: '7 g', sódio: '100 mg' }
  },
  {
    id: 'p4', ean: '7891000400409', name: 'Maçã Gala', size: 'kg',
    category: 'Hortifrúti', price: 8.99, stock: 3,
    img: 'https://picsum.photos/seed/maca/400/400',
    desc: 'Maçã gala fresca, doce e crocante.',
    nutri: { porção: '100g', calorias: '52 kcal', carbo: '14 g', proteína: '0,3 g', gordura: '0,2 g', sódio: '1 mg' }
  },
  {
    id: 'p5', ean: '7891000500502', name: 'Pão Francês', size: '500 g',
    category: 'Padaria', price: 12.90, stock: 24,
    img: 'https://picsum.photos/seed/pao/400/400',
    desc: 'Pão francês fresquinho, assado várias vezes ao dia.',
    nutri: { porção: '50g', calorias: '150 kcal', carbo: '30 g', proteína: '5 g', gordura: '1 g', sódio: '320 mg' }
  },
  {
    id: 'p6', ean: '7891000600608', name: 'Café Torrado Moído', size: '500 g',
    category: 'Mercearia', price: 18.50, stock: 12,
    img: 'https://picsum.photos/seed/cafe/400/400',
    desc: 'Café torrado e moído, blend tradicional brasileiro.',
    nutri: { porção: '10g', calorias: '4 kcal', carbo: '0 g', proteína: '0,2 g', gordura: '0 g', sódio: '2 mg' }
  },
  {
    id: 'p7', ean: '7891000700704', name: 'Queijo Mussarela', size: '200 g fatiado',
    category: 'Laticínios', price: 14.90, stock: 7,
    img: 'https://picsum.photos/seed/queijo/400/400',
    desc: 'Queijo mussarela fatiado, ideal para sanduíches.',
    nutri: { porção: '30g', calorias: '85 kcal', carbo: '0,5 g', proteína: '6 g', gordura: '7 g', sódio: '220 mg' }
  },
  {
    id: 'p8', ean: '7891000800800', name: 'Banana Prata', size: 'kg',
    category: 'Hortifrúti', price: 6.49, stock: 32,
    img: 'https://picsum.photos/seed/banana/400/400',
    desc: 'Banana prata madura, ideal para vitaminas e lanches.',
    nutri: { porção: '100g', calorias: '89 kcal', carbo: '23 g', proteína: '1,1 g', gordura: '0,3 g', sódio: '1 mg' }
  },
  {
    id: 'p9', ean: '7891000900906', name: 'Refrigerante Cola', size: '2 L',
    category: 'Bebidas', price: 9.99, stock: 56,
    img: 'https://picsum.photos/seed/refri/400/400',
    desc: 'Refrigerante de cola, garrafa PET 2 litros.',
    nutri: { porção: '200ml', calorias: '85 kcal', carbo: '21 g', proteína: '0 g', gordura: '0 g', sódio: '5 mg' }
  },
  {
    id: 'p10', ean: '7891001000101', name: 'Sabão em Pó', size: '1,6 kg',
    category: 'Limpeza', price: 22.90, stock: 9,
    img: 'https://picsum.photos/seed/sabao/400/400',
    desc: 'Sabão em pó concentrado, rende mais lavagens.',
    nutri: null
  }
];

const ORDERS = [
  {
    id: 'MK-1042', customer: 'Maria Oliveira', items: 3, total: 87.40,
    status: 'separando', createdAt: '28 mai 14:32', minutesAgo: 8,
    products: ['Arroz 5kg', 'Feijão 1kg', 'Café 500g']
  },
  {
    id: 'MK-1038', customer: 'João Silva', items: 5, total: 142.80,
    status: 'transporte', createdAt: '28 mai 13:50', minutesAgo: 50,
    products: ['Maçã kg', 'Banana kg', 'Pão 500g', 'Leite 1L', 'Queijo 200g']
  },
  {
    id: 'MK-1034', customer: 'Ana Souza', items: 2, total: 31.40,
    status: 'entregue', createdAt: '27 mai 18:12', minutesAgo: 1280,
    products: ['Refrigerante 2L', 'Sabão 1,6kg']
  }
];

const QUEUE_ORDERS = [
  { id: 'MK-1045', customer: 'Pedro Lima',     items: 2, status: 'aguardando', minutesAgo: 4,  total: 28.90 },
  { id: 'MK-1044', customer: 'Carla Mendes',   items: 4, status: 'aguardando', minutesAgo: 12, total: 67.40 },
  { id: 'MK-1043', customer: 'Lucas Pereira',  items: 6, status: 'aguardando', minutesAgo: 23, total: 122.80, late: true },
  { id: 'MK-1042', customer: 'Maria Oliveira', items: 3, status: 'separando',  minutesAgo: 8,  total: 87.40 },
  { id: 'MK-1041', customer: 'Roberto Castro', items: 1, status: 'separando',  minutesAgo: 27, total: 19.90, late: true },
  { id: 'MK-1040', customer: 'Beatriz Ramos',  items: 5, status: 'pronto',     minutesAgo: 2,  total: 94.20 },
  { id: 'MK-1039', customer: 'Felipe Costa',   items: 2, status: 'pronto',     minutesAgo: 6,  total: 41.60 },
];

const USERS = [
  { id: 'u1', name: 'Maria Oliveira', email: 'cliente@test.com', role: 'cliente', joined: '12 mar 2025', orders: 18, active: true, cpf: '123.456.789-00' },
  { id: 'u2', name: 'João Silva',     email: 'joao@cliente.br',  role: 'cliente', joined: '02 abr 2025', orders: 7,  active: true, cpf: '987.654.321-11' },
  { id: 'u3', name: 'Ana Souza',      email: 'ana@cliente.br',   role: 'cliente', joined: '17 abr 2025', orders: 3,  active: true, cpf: '456.789.123-22' },
  { id: 'u4', name: 'Carlos Operador', email: 'operador@test.com', role: 'operador', joined: '08 jan 2025', orders: 0, active: true, perms: ['estoque','fila'] },
  { id: 'u5', name: 'Beatriz Lima',    email: 'beatriz.op@marketech.com.br', role: 'operador', joined: '21 fev 2025', orders: 0, active: true, perms: ['fila'] },
  { id: 'u6', name: 'Admin Geral',     email: 'admin@test.com', role: 'admin', joined: '01 jan 2025', orders: 0, active: true, perms: ['todas'] },
];

const SALES_BY_DAY = [
  { day: '22', value: 4200 }, { day: '23', value: 5100 }, { day: '24', value: 4800 },
  { day: '25', value: 6300 }, { day: '26', value: 7100 }, { day: '27', value: 5900 }, { day: '28', value: 8400 }
];

const TOP_PRODUCTS = [
  { productId: 'p5', sold: 248 },
  { productId: 'p1', sold: 192 },
  { productId: 'p8', sold: 174 },
  { productId: 'p3', sold: 156 },
  { productId: 'p2', sold: 143 },
];

const CATEGORIES = ['Mercearia', 'Hortifrúti', 'Laticínios', 'Padaria', 'Bebidas', 'Limpeza'];

const TEST_EMAILS = {
  'cliente@test.com':  { role: 'cliente',  screen: 'catalog'  },
  'operador@test.com': { role: 'operador', screen: 'queue'    },
  'admin@test.com':    { role: 'admin',    screen: 'dashboard' }
};

window.MARKETECH_DATA = { PRODUCTS, ORDERS, QUEUE_ORDERS, USERS, SALES_BY_DAY, TOP_PRODUCTS, CATEGORIES, TEST_EMAILS };
