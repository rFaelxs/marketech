/* ============================================================
 * Marketech — JSX Component Reference (Admin)
 * ============================================================ */

// -------------------- KPICard --------------------
function KPICard({ label, value, delta, direction = 'up' }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && (
        <div className={`delta ${direction}`}>
          <Icon name={direction === 'up' ? 'trending-up' : 'trending-down'} size={12} />
          {delta}
        </div>
      )}
    </div>
  );
}

// -------------------- BarChart --------------------
function BarChart({ data /* [{day, value}] */ }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div>
      <div className="bar-chart">
        {data.map(d => (
          <div key={d.day} className="bar" style={{ height: `${(d.value / max * 100).toFixed(0)}%` }}>
            <span className="v">{(d.value / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
      <div className="bar-labels">
        {data.map(d => <span key={d.day}>{d.day} mai</span>)}
      </div>
    </div>
  );
}

// -------------------- TopProductList --------------------
function TopProductList({ items /* [{product, sold}] */ }) {
  return (
    <div className="top-list">
      {items.map((it, i) => (
        <div key={it.product.id} className="top-item">
          <div className="rank">#{i + 1}</div>
          <div className="thumb"><img src={it.product.img} alt="" /></div>
          <div>
            <div className="name">{it.product.name}</div>
            <div className="meta">{it.product.category} · {formatBRL(it.product.price)}</div>
          </div>
          <div className="qty">{it.sold}</div>
        </div>
      ))}
    </div>
  );
}

// -------------------- UserRow --------------------
function UserRow({ user, onRemove, onSetPerms }) {
  const initial = user.name.charAt(0).toUpperCase();
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--primary-50)', color: 'var(--primary-700)',
            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13
          }}>{initial}</div>
          <span style={{ fontWeight: 500 }}>{user.name}</span>
        </div>
      </td>
      <td className="ean">{user.email}</td>
      <td><span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--fg-1)' }}>{user.role}</span></td>
      <td style={{ color: 'var(--fg-2)', fontSize: 13 }}>{user.joined}</td>
      <td className="num">{user.orders}</td>
      <td>
        <span className={`pill-status ${user.active ? 'on' : 'off'}`}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          {user.active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>
        <div className="actions">
          {user.role !== 'cliente' && (
            <button className="btn btn-secondary btn-sm" onClick={() => onSetPerms(user.id)}>Permissões</button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => onRemove(user.id)}>Remover</button>
        </div>
      </td>
    </tr>
  );
}
