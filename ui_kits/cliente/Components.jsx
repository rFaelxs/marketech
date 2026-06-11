/* ============================================================
 * Marketech — JSX Component Reference (Cliente)
 *
 * Cosmetic React recreations of the cliente-flow components.
 * Import the tokens via colors_and_type.css; these components
 * read CSS vars, not Tailwind. Use as a starting point for
 * production React work.
 * ============================================================ */

// -------------------- Button --------------------
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const cls = `btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}`;
  return <button className={cls} {...props}>{children}</button>;
}

// -------------------- ProductCard --------------------
function ProductCard({ product, onAdd, onOpen }) {
  const stockLabel =
    product.stock === 0 ? 'Sem estoque' :
    product.stock < 5  ? `Restam ${product.stock} un.` :
                         `${product.stock} un. em estoque`;
  const stockCls =
    product.stock === 0 ? 'out' :
    product.stock < 5  ? 'low' : '';

  return (
    <article className="pcard" onClick={() => onOpen?.(product.id)}>
      <div className="pcard-img">
        <img src={product.img} alt={product.name} loading="lazy" />
        {product.stock === 0 && <div className="out">Indisponível</div>}
      </div>
      <div className="pcard-body">
        <div className="pcard-category">{product.category}</div>
        <div className="pcard-name">
          {product.name} <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>{product.size}</span>
        </div>
        <div className="pcard-price num">{formatBRL(product.price)}</div>
        <div className={`pcard-stock ${stockCls}`}>{stockLabel}</div>
        <div className="pcard-add">
          {product.stock > 0 ? (
            <Button size="sm" className="btn-block" onClick={(e) => { e.stopPropagation(); onAdd?.(product.id); }}>
              Adicionar
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled>Indisponível</Button>
          )}
        </div>
      </div>
    </article>
  );
}

// -------------------- OrderProgress --------------------
const ORDER_STEPS = [
  { id: 'confirmado', label: 'Confirmado' },
  { id: 'separando',  label: 'Separando' },
  { id: 'transporte', label: 'Em Transporte' },
  { id: 'entregue',   label: 'Entregue' },
];

function OrderProgress({ status }) {
  const idx = ORDER_STEPS.findIndex(s => s.id === status);
  const cancelled = status === 'cancelado';
  return (
    <div className="progress-bar">
      {ORDER_STEPS.map((s, i) => {
        let cls = '';
        if (cancelled) cls = i === 0 ? 'cancelled' : '';
        else if (i < idx) cls = 'done';
        else if (i === idx) cls = 'active';
        return (
          <div key={s.id} className={`progress-step ${cls}`}>
            <div className="bar" />
            <div className="label">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------- CouponInput --------------------
function CouponInput({ value, onApply }) {
  const [code, setCode] = React.useState(value || '');
  return (
    <div className="coupon-row">
      <input
        className="input"
        placeholder="Código de cupom"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
      />
      <Button variant="secondary" size="sm" onClick={() => onApply(code)}>Aplicar</Button>
    </div>
  );
}

// -------------------- Helpers --------------------
const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
function formatBRL(n) { return fmt.format(n); }
