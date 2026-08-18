import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { X, Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { COLORS, tooltipStyle } from "../theme.js";
import { fmtMoney, fmtShort, fmtPct, fmtQty, fmtDateShort, valueOf, gainPct } from "../utils/format.js";
import HoldingForm from "./HoldingForm.jsx";

export default function ExpandedPanel({
  section,
  origin,
  open,
  list,
  snapshots,
  formOpen,
  form,
  setForm,
  formError,
  editingId,
  onOpenAdd,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
  onClose,
  icon: Icon,
  title,
  broker,
  accent,
}) {
  const total = list.reduce((s, h) => s + valueOf(h), 0);
  const invested = list.reduce((s, h) => s + h.quantity * h.avgCost, 0);
  const gp = invested > 0 ? ((total - invested) / invested) * 100 : 0;
  const histKey = section === "crypto" ? "totalCrypto" : "totalStocks";
  const histData = snapshots.map((s) => ({ date: s.date, value: s[histKey] }));

  return (
    <div className={"expandBackdrop" + (open ? " open" : "")} onClick={onClose}>
      <div
        className={"expandPanel glassDark" + (open ? " open" : "")}
        style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="expandHeader">
          <div className="widgetIcon" style={{ background: accent + "33", color: accent }}>
            <Icon size={18} />
          </div>
          <div>
            <div className="expandTitle">{title}</div>
            <div className="widgetBroker" style={{ color: COLORS.textMutedOnDark }}>
              {broker}
            </div>
          </div>
          <button className="iconBtnDark" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <div className="heroStats" style={{ marginTop: 18 }}>
          <div className="heroStat">
            <span className="heroStatLabel">Total</span>
            <span className="heroStatValue">{fmtMoney(total)}</span>
          </div>
          <div className="heroStat">
            <span className="heroStatLabel">Invertido</span>
            <span className="heroStatValue">{fmtMoney(invested)}</span>
          </div>
          <div className="heroStat">
            <span className="heroStatLabel">Rendimiento</span>
            <span className={"heroStatValue " + (gp >= 0 ? "up" : "down")}>{fmtPct(gp)}</span>
          </div>
        </div>

        {histData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={histData} margin={{ left: 4, right: 8, top: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="expandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDateShort} tick={{ fill: COLORS.textMutedOnDark, fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.textMutedOnDark, fontSize: 11 }} axisLine={false} tickLine={false} width={54} tickFormatter={fmtShort} />
              <Tooltip formatter={(v) => [fmtMoney(v), title]} labelFormatter={fmtDateShort} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill="url(#expandGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="widgetEmpty" style={{ marginTop: 12 }}>
            Todavía no hay historial suficiente para graficar.
          </div>
        )}

        <div className="expandListHeader">
          <div className="cardTitle" style={{ color: COLORS.textOnDark, marginBottom: 0 }}>
            Posiciones
          </div>
          {!formOpen && (
            <button className="btnLight" onClick={onOpenAdd}>
              <Plus size={14} /> Agregar
            </button>
          )}
        </div>

        {formOpen && (
          <HoldingForm
            form={form}
            setForm={setForm}
            formSection={section}
            setFormSection={() => {}}
            editingId={editingId}
            formError={formError}
            onSubmit={onSubmit}
            onCancel={onCancel}
            lockSection
          />
        )}

        {list.length === 0 ? (
          <div className="widgetEmpty">Todavía no agregaste nada acá.</div>
        ) : (
          <div className="tableScroll">
            <div className="holdingRow headerRow">
              <div>Símbolo</div>
              <div className="colQty">Cantidad</div>
              <div className="colPrice">Precio actual</div>
              <div>Valor</div>
              <div>Rend.</div>
              <div></div>
            </div>
            {list.map((h) => (
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
                  <button onClick={() => onEdit(section, h)} aria-label="Editar">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => onDelete(section, h.id)} aria-label="Eliminar">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
