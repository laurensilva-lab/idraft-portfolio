import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Plus, ArrowRight, X, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { fmtMoney, fmtPct, fmtQty, valueOf, gainPct } from "../utils/format.js";

export default function PortfolioWidget({ title, broker, icon: Icon, accent, list, sparkData, onAdd, isExpanded, onToggle, onEdit, onDelete }) {
  const total = list.reduce((s, h) => s + valueOf(h), 0);
  const invested = list.reduce((s, h) => s + h.quantity * h.avgCost, 0);
  const top = [...list].sort((a, b) => valueOf(b) - valueOf(a)).slice(0, 3);
  const all = [...list].sort((a, b) => valueOf(b) - valueOf(a));

  return (
    <div className={"glass widget" + (isExpanded ? " expanded" : "")} onClick={!isExpanded ? onToggle : undefined}>
      <div className="widgetHeader">
        <div className="widgetIcon" style={{ background: accent + "22", color: accent }}>
          <Icon size={16} />
        </div>
        <div>
          <div className="widgetTitle">{title}</div>
          <div className="widgetBroker">{broker}</div>
        </div>
        {!isExpanded ? (
          <button
            className="iconBtn"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            aria-label={"Agregar " + title}
          >
            <Plus size={14} />
          </button>
        ) : (
          <button
            className="iconBtn"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={isExpanded ? 90 : 46}>
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

      {!isExpanded ? (
        <>
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
            <div className="linkBtn">
              Ver todas ({list.length}) <ArrowRight size={13} />
            </div>
          )}
        </>
      ) : (
        <div className="tableScroll">
          {all.length === 0 ? (
            <div className="widgetEmpty">Todavía no agregaste nada acá.</div>
          ) : (
            <>
              <div className="holdingRow headerRow">
                <div>Símbolo</div>
                <div className="colQty">Cantidad</div>
                <div className="colPrice">Precio actual</div>
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(h);
                      }}
                      aria-label="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(h.id);
                      }}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
