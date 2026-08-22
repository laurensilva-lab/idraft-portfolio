import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { X, Maximize2 } from "lucide-react";
import { COLORS, tooltipStyle } from "../theme.js";
import { fmtMoney, fmtShort, fmtDateShort } from "../utils/format.js";

export default function EvolutionChart({ snapshots, isExpanded, onToggle }) {
  const h = isExpanded ? 340 : 220;
  return (
    <div className={"glass evolutionCard" + (isExpanded ? " expanded" : "")} onClick={!isExpanded ? onToggle : undefined}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div className="cardTitle" style={{marginBottom:0}}>Evolución del patrimonio</div>
        <button className="iconBtn" onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label={isExpanded ? "Cerrar" : "Expandir"}>
          {isExpanded ? <X size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      <div onClick={(e) => isExpanded && e.stopPropagation()}>
        {snapshots.length >= 2 ? (
          <ResponsiveContainer width="100%" height={h}>
            <AreaChart data={snapshots} margin={{ left: 4, right: 8, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="cryptoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.violet} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={COLORS.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(23,23,26,0.08)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDateShort} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: "rgba(23,23,26,0.12)" }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={56} tickFormatter={fmtShort} />
              <Tooltip formatter={(v, name) => [fmtMoney(v), name === "totalCrypto" ? "Cripto" : "Acciones"]} labelFormatter={fmtDateShort} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="totalCrypto" stackId="1" stroke={COLORS.amber} strokeWidth={2} fill="url(#cryptoGrad)" />
              <Area type="monotone" dataKey="totalStocks" stackId="1" stroke={COLORS.violet} strokeWidth={2} fill="url(#stockGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="widgetEmpty">Actualizá precios para ver la evolución acá.</div>
        )}
      </div>
    </div>
  );
}
