import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { fmtMoney, fmtPct, fmtQty, valueOf, gainPct } from "../utils/format.js";

export default function PortfolioWidget({ title, broker, icon: Icon, accent, list, sparkData, onAdd, onEdit, onDelete }) {
  const total = list.reduce((s, h) => s + valueOf(h), 0);
  const invested = list.reduce((s, h) => s + h.quantity * h.avgCost, 0);
  const all = [...list].sort((a, b) => valueOf(b) - valueOf(a));

  return (
    <div className="glass widget">
      <div className="widgetHeader">
        <div className="widgetIcon" style={{ background: accent + "22", color: accent }}>
          <Icon size={16} />
        </div>
        <div>
          <div className="widgetTitle">{title}</div>
          <div className="widgetBroker">{broker}</div>
        </div>
        <button
          className="iconBtn"
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          aria-label={"Agregar " + title}
        >
          <Plus size={14} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={46}>
        <AreaChart data={sparkData}>
          <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill={accent} fillOpacity={0.18} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="widgetStats">
        <div>
          <span className="statLabel">Total</span>
          <span className="statValue">{fmtMoney(total)}</span>
        </div>
        <div>
          <span className="statLabel">Invertido</span>
          <span className="statValue muted">{fmtMoney(invested)}</span>
        </div>
      </div>

      {all.length === 0 ? (
        <div className="widgetEmpty">Sin posiciones todavía.</div>
      ) : (
        <div className="widgetList">
          <div className="holdingRow headerRow" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: "8px", padding: "6px 4px" }}>
            <div>Símbolo</div>
            <div>Valor</div>
            <div>Rend.</div>
            <div></div>
          </div>
          {all.map((h) => (
            <div key={h.id} className="widgetListRow" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: "8px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="sectionDot" style={{ background: accent }} />
                <span className="holdingSymbol" style={{ fontSize: "12.5px" }}>{h.symbol}</span>
                {h.name && <span className="holdingName">{h.name}</span>}
              </div>
              <span className="mono" style={{ fontSize: "12.5px" }}>{fmtMoney(valueOf(h))}</span>
              <span className={gainPct(h) >= 0 ? "up" : "down"} style={{ fontSize: "12px" }}>
                {gainPct(h) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {fmtPct(gainPct(h))}
              </span>
              <div className="holdingActions">
                <button onClick={(e) => { e.stopPropagation(); onEdit(h); }} aria-label="Editar"><Pencil size={12} /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(h.id); }} aria-label="Eliminar"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
