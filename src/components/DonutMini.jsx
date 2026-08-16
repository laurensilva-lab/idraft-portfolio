import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { fmtMoney } from "../utils/format.js";
import { tooltipStyle } from "../theme.js";

export default function DonutMini({ title, data }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass donutCard">
      <div className="cardTitle">{title}</div>
      {total > 0 ? (
        <>
          <div className="donutWrap">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={72} paddingAngle={3} stroke="none">
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [fmtMoney(v), name]} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donutCenter">
              <div className="donutCenterValue">{fmtMoney(total)}</div>
            </div>
          </div>
          <div className="legend">
            {data.map((d, i) => (
              <div className="legendRow" key={i}>
                <span className="dot" style={{ background: d.color }} />
                <span className="legendName">{d.name}</span>
                <span className="legendPct">{((d.value / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="widgetEmpty">Sin datos todavía.</div>
      )}
    </div>
  );
}
