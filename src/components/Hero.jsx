import { RefreshCw } from "lucide-react";
import { COLORS } from "../theme.js";
import { fmtMoney, fmtPct, fmtDateTime } from "../utils/format.js";

export default function Hero({ totalAll, investedAll, gainPctAll, lastUpdated, pctCrypto, pctStocks, updating, updateMsg, onRefresh }) {
  return (
    <div className="glassDark hero">
      <div className="heroTop">
        <div>
          <div className="heroEyebrow">Patrimonio total</div>
          <div className="heroValue">{fmtMoney(totalAll)}</div>
        </div>
        <button className="btnLight" onClick={onRefresh} disabled={updating}>
          <RefreshCw size={14} className={updating ? "spin" : ""} /> {updating ? "Actualizando…" : "Actualizar precios"}
        </button>
      </div>

      <div className="heroStats">
        <div className="heroStat">
          <span className="heroStatLabel">Invertido</span>
          <span className="heroStatValue">{fmtMoney(investedAll)}</span>
        </div>
        <div className="heroStat">
          <span className="heroStatLabel">Rendimiento</span>
          <span className={"heroStatValue " + (gainPctAll >= 0 ? "up" : "down")}>{fmtPct(gainPctAll)}</span>
        </div>
        <div className="heroStat">
          <span className="heroStatLabel">Última actualización</span>
          <span className="heroStatValue">{fmtDateTime(lastUpdated)}</span>
        </div>
      </div>

      {totalAll > 0 && (
        <>
          <div className="allocBar">
            <div style={{ width: `${pctCrypto}%`, background: COLORS.amber }} />
            <div style={{ width: `${pctStocks}%`, background: COLORS.violet }} />
          </div>
          <div className="allocLegend">
            <span>
              <i className="dotAmber" /> Cripto {pctCrypto.toFixed(0)}%
            </span>
            <span>
              <i className="dotViolet" /> Acciones {pctStocks.toFixed(0)}%
            </span>
          </div>
        </>
      )}

      {updateMsg && <div className="updateMsg">{updateMsg}</div>}
    </div>
  );
}
