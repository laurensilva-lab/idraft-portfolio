import { X, Check } from "lucide-react";

export default function HoldingForm({ form, setForm, formSection, setFormSection, editingId, formError, onSubmit, onCancel }) {
  return (
    <div className="formCard">
      <div className="segmented">
        <button
          type="button"
          className={"segBtn" + (formSection === "crypto" ? " active" : "") + (editingId ? " disabled" : "")}
          onClick={() => !editingId && setFormSection("crypto")}
        >
          Cripto (Binance)
        </button>
        <button
          type="button"
          className={"segBtn" + (formSection === "stocks" ? " active" : "") + (editingId ? " disabled" : "")}
          onClick={() => !editingId && setFormSection("stocks")}
        >
          Acción (Prex)
        </button>
      </div>

      <div className="formGrid">
        <label>
          <span>Símbolo</span>
          <input value={form.symbol} onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))} placeholder={formSection === "stocks" ? "AAPL" : "BTC"} />
        </label>
        <label>
          <span>Nombre (opcional)</span>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder={formSection === "stocks" ? "Apple Inc." : "Bitcoin"} />
        </label>
        <label>
          <span>Cantidad</span>
          <input type="number" step="any" min="0" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="0" />
        </label>
        <label>
          <span>Precio de compra prom.</span>
          <input type="number" step="any" min="0" value={form.avgCost} onChange={(e) => setForm((p) => ({ ...p, avgCost: e.target.value }))} placeholder="0.00" />
        </label>
        <label>
          <span>Precio actual</span>
          <input type="number" step="any" min="0" value={form.currentPrice} onChange={(e) => setForm((p) => ({ ...p, currentPrice: e.target.value }))} placeholder="0.00" />
        </label>
      </div>

      {formError && <div className="formError">{formError}</div>}

      <div className="formActions">
        <button className="btnGhost" onClick={onCancel}>
          <X size={14} /> Cancelar
        </button>
        <button className="btnPrimary" onClick={onSubmit}>
          <Check size={14} /> {editingId ? "Guardar cambios" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
