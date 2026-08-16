import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Plus, ArrowRight } from "lucide-react";
import { fmtMoney, fmtPct, valueOf, gainPct } from "../utils/format.js";

export default function PortfolioWidget({ title, broker, icon: Icon, accent, list, sparkData, onAdd, onSeeAll }) {
  const total = list.reduce((s, h) => s + valueOf(h), 0);
  const invested = list.reduce((s, h) => s + h.quantity * h.avgCost, 0);
  const top = [...list].sort((a, b) => valueOf(b) - valueOf(a)).slice(0, 3);

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
        <button className="iconBtn" onClick={onAdd} aria-label={"Agregar " + title}>
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

      {top.length > 0 ? (
        <div className="widgetList">
          {top.map((h) => (
            <div className="widgetListRow" key={h.id}>
              <span className="mono">{h.symbol}</span>
              <span className={gainPct(h) >= 0 ? "up" : "down"}>{fmtPct(gainPct(h))}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="widgetEmpty">Sin posiciones todavía.</div>
      )}

      {list.length > 0 && (
        <button className="linkBtn" onClick={onSeeAll}>
          Ver todas ({list.length}) <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}
