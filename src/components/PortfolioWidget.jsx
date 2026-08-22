import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Plus, X, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { fmtMoney, fmtPct, fmtQty, valueOf, gainPct } from "../utils/format.js";

export default function PortfolioWidget({ title, broker, icon: Icon, accent, list, sparkData, onAdd, isExpanded, onToggle, onEdit, onDelete }) {
  const total = list.reduce((s, h) => s + valueOf(h), 0);
  const invested = list.reduce((s, h) => s + h.quantity * h.avgCost, 0);
  const all = [...list].sort((a, b) => valueOf(b) - valueOf(a));
  const preview = all.slice(0, 3);

  return (
    <div
      className={"glass widget" + (isExpanded ? " expanded" : "")}
      onClick={!isExpanded ? onToggle : undefined}
    >
      <div className="widgetHeader">
        <div className="widgetIcon" style={{ background: accent + "22", color: accent }}>
          <Icon size={16} />
        </div>
        <div>
          <div className="widgetTitle">{title}</div>
          <div className="widgetBroker">{broker}</div>
        </div>
        {!isExpanded ? (
          <button className="iconBtn" onClick={(e) => { e.stopPropagation(); onAdd(); }} aria-label={"Agregar " + title}>
            <Plus size={14} />
          </button>
        ) : (
          <button className="iconBtn" onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label="Cerrar">
            <X size={14} />
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={isExpanded ? 80 : 46}>
        <AreaChart data={sparkData}>
          <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill={accent} fillOpacity={0.18} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="widgetStats">
        <div><span className="statLabel">Total</span><span className="statValue">{fmtMoney(total)}</span></div>
        <div><span className="statLabel">Invertido</span><span className="statValue muted">{fmtMoney(invested)}</span></div>
      </div>

      {!isExpanded ? (
        <>
          {preview.length > 0 ? (
            <div className="widgetList">
              {preview.map((h) => (
                <div className="widgetListRow" key={h.id}>
                  <span className="mono">{h.symbol}</span>
                  <span className={gainPct(h) >= 0 ? "up" : "down"}>{fmtPct(gainPct(h))}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="widgetEmpty">Sin posiciones todavía.</div>
          )}
          {all.length > 3 && <div className="widgetEmpty" style={{marginTop:4}}>+{all.length - 3} más — tocá para ver todas</div>}
        </>
      ) : (
        <div className="expandedList" onClick={(e) => e.stopPropagation()}>
          {all.length === 0 ? (
            <div className="widgetEmpty">Todavía no agregaste nada acá.</div>
          ) : (
            <>
              <div className="holdingRow headerRow">
                <div>Símbolo</div>
                <div className="colQty">Cant.</div>
                <div className="colPrice">Precio</div>
                <div>Valor</div>
                <div>Rend.</div>
                <div></div>
              </div>
              {all.map((h) => (
                <div className="holdingRow" key={h.id}>
                  <div className="holdingMain">
                    <span className="sectionDot" style={{ background: accent }} />
                    <span className="holdingSymbol">{h.symbol}</span>
                    {h.name && <span className="holdingName">{h.name}</span>}
                  </div>
                  <div className="colQty">{fmtQty(h.quantity)}</div>
                  <div className="colPrice">{fmtMoney(h.currentPrice)}</div>
                  <div className="mono">{fmtMoney(valueOf(h))}</div>
                  <div className={gainPct(h) >= 0 ? "up" : "down"}>
                    {gainPct(h) >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {fmtPct(gainPct(h))}
                  </div>
                  <div className="holdingActions">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(h); }}><Pencil size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(h.id); }}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </>
          )}
          <button className="btnGhost" style={{marginTop:12,width:"100%",justifyContent:"center"}} onClick={(e) => { e.stopPropagation(); onAdd(); }}>
            <Plus size={14} /> Agregar
          </button>
        </div>
      )}
    </div>
  );
}
