/* ============================================================
 * Marketech — JSX Component Reference (Operador)
 * ============================================================ */

// -------------------- KanbanCard --------------------
function KanbanCard({ order, onPrint, onAdvance, onDispatch }) {
  const isReady = order.status === 'pronto';
  return (
    <div className={`kanban-card ${order.late ? 'late' : ''}`}>
      <div className="row1">
        <span className="id">#{order.id}</span>
        <span className="time">{order.late ? `⚠ ${order.minutesAgo} min` : `${order.minutesAgo} min`}</span>
      </div>
      <div className="customer">{order.customer}</div>
      <div className="items">{order.items} {order.items === 1 ? 'item' : 'itens'} · {formatBRL(order.total)}</div>
      <div className="actions">
        <button className="btn btn-secondary btn-sm" onClick={() => onPrint(order.id)}>
          <Icon name="printer" /> Imprimir
        </button>
        {isReady
          ? <button className="btn btn-primary btn-sm" onClick={() => onDispatch(order.id)}>Despachar</button>
          : <button className="btn btn-primary btn-sm" onClick={() => onAdvance(order.id)}>{order.status === 'aguardando' ? 'Iniciar' : 'Pronto'}</button>
        }
      </div>
    </div>
  );
}

// -------------------- KanbanColumn --------------------
function KanbanColumn({ id, label, icon, orders, ...handlers }) {
  return (
    <div className="kanban-col">
      <div className="kanban-head">
        <div className="name"><Icon name={icon} size={14} /> {label}</div>
        <div className="count">{orders.length}</div>
      </div>
      {orders.length === 0
        ? <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--fg-3)', fontSize: 12 }}>Sem pedidos</div>
        : orders.map(o => <KanbanCard key={o.id} order={o} {...handlers} />)
      }
    </div>
  );
}

// -------------------- ProductRow (data table) --------------------
function ProductRow({ product, onEditPrice, onEditStock, onToggle }) {
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 500 }}>{product.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{product.size}</div>
      </td>
      <td className="ean">{product.ean}</td>
      <td><span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{product.category}</span></td>
      <td className="price">{formatBRL(product.price)}</td>
      <td><span className="num" style={{ fontWeight: 600 }}>{product.stock}</span> <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>un.</span></td>
      <td>
        <span className={`pill-status ${product.stock > 0 ? 'on' : 'off'}`}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          {product.stock > 0 ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>
        <div className="actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onEditPrice(product.id)}>Preço</button>
          <button className="btn btn-secondary btn-sm" onClick={() => onEditStock(product.id)}>Estoque</button>
          <button className="btn btn-ghost btn-sm" onClick={() => onToggle(product.id)}>
            {product.stock > 0 ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </td>
    </tr>
  );
}
