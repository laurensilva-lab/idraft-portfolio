import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { X, Maximize2 } from "lucide-react";
import { fmtMoney } from "../utils/format.js";
import { tooltipStyle } from "../theme.js";

export default function DonutMini({ title, data, isExpanded, onToggle }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = isExpanded ? 260 : 160;
  const inner = isExpanded ? 80 : 50;
  const outer = isExpanded ? 115 : 72;

  return (
    <div className={"glass donutCard" + (isExpanded ? " expanded" : "")} onClick={!isExpanded ? onToggle : undefined}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div className="cardTitle" style={{marginBottom:0}}>{title}</div>
        <button className="iconBtn" onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label={isExpanded ? "Cerrar" : "Expandir"}>
          {isExpanded ? <X size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      {total > 0 ? (
        <div onClick={(e) => isExpanded && e.stopPropagation()}>
          <div className="donutWrap">
            <ResponsiveContainer width="100%" height={size}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={inner} outerRadius={outer} paddingAngle={3} stroke="none">
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v, name) => [fmtMoney(v), name]} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donutCenter"><div className="donutCenterValue">{fmtMoney(total)}</div></div>
          </div>
          <div className="legend">
            {data.map((d, i) => (
              <div className="legendRow" key={i}>
                <span className="dot" style={{ background: d.color }} />
                <span className="legendName">{d.name}</span>
                <span className="legendPct">{((d.value / total) * 100).toFixed(0)}%</span>
                {isExpanded && <span className="mono" style={{marginLeft:"auto",fontSize:12}}>{fmtMoney(d.value)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="widgetEmpty">Sin datos todavía.</div>
      )}
    </div>
  );
}
