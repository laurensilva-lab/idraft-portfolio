import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { COLORS } from "../theme.js";
import { fmtMoney, fmtQty, fmtPct, valueOf, gainPct } from "../utils/format.js";
import HoldingForm from "./HoldingForm.jsx";

export default function HoldingsTable({
  filter,
  setFilter,
  filteredHoldings,
  formOpen,
  formSection,
  setFormSection,
  editingId,
  form,
  setForm,
  formError,
  onOpenAdd,
  onEdit,
  onDelete,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="glass tableCard">
      <div className="tableHeader">
        <div className="filterTabs">
          {[
            ["all", "Todo"],
            ["crypto", "Cripto"],
            ["stocks", "Acciones"],
          ].map(([k, l]) => (
            <button key={k} className={"filterTab" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>
              {l}
            </button>
          ))}
        </div>
        {!formOpen && (
          <button className="btnPrimary" onClick={onOpenAdd}>
            <Plus size={14} /> Agregar posición
          </button>
        )}
      </div>

      {formOpen && (
        <HoldingForm
          form={form}
          setForm={setForm}
          formSection={formSection}
          setFormSection={setFormSection}
          editingId={editingId}
          formError={formError}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}

      {filteredHoldings.length === 0 ? (
        <div className="widgetEmpty">No hay posiciones para mostrar todavía.</div>
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
          {filteredHoldings.map((h) => (
            <div className="holdingRow" key={h.id}>
              <div className="holdingMain">
                <span className="sectionDot" style={{ background: h.section === "crypto" ? COLORS.amber : COLORS.violet }} />
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
                <button onClick={() => onEdit(h.section, h)} aria-label="Editar">
                  <Pencil size={13} />
                </button>
                <button onClick={() => onDelete(h.section, h.id)} aria-label="Eliminar">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
