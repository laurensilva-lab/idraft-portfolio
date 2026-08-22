import { useState, useEffect } from "react";
import Background from "./components/Background.jsx";
import Hero from "./components/Hero.jsx";
import PortfolioWidget from "./components/PortfolioWidget.jsx";
import DonutMini from "./components/DonutMini.jsx";
import EvolutionChart from "./components/EvolutionChart.jsx";
import HoldingsTable from "./components/HoldingsTable.jsx";
import { Bitcoin, Landmark } from "lucide-react";
import { COLORS, CONCENTRATION_COLORS } from "./theme.js";
import { uid, valueOf, sparkFor } from "./utils/format.js";
import { KEYS, loadJSON, saveJSON } from "./utils/storage.js";
import { fetchCryptoPrice, fetchStockPrice } from "./utils/priceApi.js";

const emptyForm = { symbol: "", name: "", quantity: "", avgCost: "", currentPrice: "" };

export default function App() {
  const [stocks, setStocks] = useState(() => loadJSON(KEYS.HOLDINGS, { stocks: [], crypto: [] }).stocks || []);
  const [crypto, setCrypto] = useState(() => loadJSON(KEYS.HOLDINGS, { stocks: [], crypto: [] }).crypto || []);
  const [snapshots, setSnapshots] = useState(() => loadJSON(KEYS.SNAPSHOTS, []));
  const [lastUpdated, setLastUpdated] = useState(() => loadJSON(KEYS.LAST_UPDATED, null));

  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formSection, setFormSection] = useState("crypto");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    saveJSON(KEYS.HOLDINGS, { stocks, crypto });
  }, [stocks, crypto]);

  useEffect(() => {
    saveJSON(KEYS.SNAPSHOTS, snapshots);
  }, [snapshots]);

  useEffect(() => {
    if (lastUpdated) saveJSON(KEYS.LAST_UPDATED, lastUpdated);
  }, [lastUpdated]);

  function listFor(section) {
    return section === "stocks" ? stocks : crypto;
  }
  function setListFor(section, updater) {
    if (section === "stocks") setStocks(updater);
    else setCrypto(updater);
  }

  function openAddForm(section) {
    setFormOpen(true);
    setEditingId(null);
    setFormSection(section || (filter !== "all" ? filter : "crypto"));
    setForm(emptyForm);
    setFormError("");
  }

  function openEditForm(section, h) {
    setFormOpen(true);
    setEditingId(h.id);
    setFormSection(section);
    setForm({
      symbol: h.symbol,
      name: h.name || "",
      quantity: String(h.quantity),
      avgCost: String(h.avgCost),
      currentPrice: String(h.currentPrice),
    });
    setFormError("");
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function submitForm() {
    const symbol = form.symbol.trim().toUpperCase();
    const quantity = parseFloat(form.quantity);
    const avgCost = parseFloat(form.avgCost);
    const currentPrice = parseFloat(form.currentPrice);

    if (!symbol) return setFormError("Ingresá un símbolo.");
    if (!Number.isFinite(quantity) || quantity <= 0) return setFormError("La cantidad debe ser mayor a 0.");
    if (!Number.isFinite(avgCost) || avgCost < 0) return setFormError("El precio de compra no puede ser negativo.");
    if (!Number.isFinite(currentPrice) || currentPrice < 0) return setFormError("El precio actual no puede ser negativo.");

    const holding = { id: editingId || uid(), symbol, name: form.name.trim(), quantity, avgCost, currentPrice };
    setListFor(formSection, (prev) => {
      if (editingId) return prev.map((h) => (h.id === editingId ? holding : h));
      return [...prev, holding];
    });
    closeForm();
  }

  function deleteHolding(section, id) {
    setListFor(section, (prev) => prev.filter((h) => h.id !== id));
  }

  function upsertSnapshot(total, totalStocksArg, totalCryptoArg) {
    const today = new Date().toISOString().slice(0, 10);
    const entry = { date: today, total, totalStocks: totalStocksArg, totalCrypto: totalCryptoArg };
    setSnapshots((prev) => {
      const idx = prev.findIndex((s) => s.date === today);
      let next;
      if (idx >= 0) {
        next = [...prev];
        next[idx] = entry;
      } else {
        next = [...prev, entry];
      }
      next.sort((a, b) => a.date.localeCompare(b.date));
      return next;
    });
  }

  async function refreshPrices() {
    if (stocks.length === 0 && crypto.length === 0) {
      setUpdateMsg("Agregá alguna posición primero.");
      setTimeout(() => setUpdateMsg(""), 3000);
      return;
    }
    setUpdating(true);
    setUpdateMsg("");
    let successCount = 0;
    let failCount = 0;

    const newCrypto = await Promise.all(
      crypto.map(async (h) => {
        try {
          const price = await fetchCryptoPrice(h.symbol);
          successCount++;
          return { ...h, currentPrice: price };
        } catch (e) {
          failCount++;
          return h;
        }
      })
    );

    const newStocks = await Promise.all(
      stocks.map(async (h) => {
        try {
          const price = await fetchStockPrice(h.symbol);
          successCount++;
          return { ...h, currentPrice: price };
        } catch (e) {
          failCount++;
          return h;
        }
      })
    );

    setCrypto(newCrypto);
    setStocks(newStocks);

    const newTotalCrypto = newCrypto.reduce((s, h) => s + valueOf(h), 0);
    const newTotalStocks = newStocks.reduce((s, h) => s + valueOf(h), 0);
    upsertSnapshot(newTotalCrypto + newTotalStocks, newTotalStocks, newTotalCrypto);

    setLastUpdated(new Date().toISOString());
    setUpdating(false);

    if (successCount === 0) {
      setUpdateMsg("No pude conectarme a las cotizaciones desde acá. Cargá los precios a mano.");
    } else if (failCount > 0) {
      setUpdateMsg(`Actualicé ${successCount} de ${successCount + failCount} precios. El resto lo podés cargar a mano.`);
    } else {
      setUpdateMsg(`Precios actualizados (${successCount}).`);
    }
    setTimeout(() => setUpdateMsg(""), 6000);
  }

  const totalCryptoVal = crypto.reduce((s, h) => s + valueOf(h), 0);
  const totalStocksVal = stocks.reduce((s, h) => s + valueOf(h), 0);
  const totalAll = totalCryptoVal + totalStocksVal;
  const investedAll = [...stocks, ...crypto].reduce((s, h) => s + h.quantity * h.avgCost, 0);
  const gainAbsAll = totalAll - investedAll;
  const gainPctAll = investedAll > 0 ? (gainAbsAll / investedAll) * 100 : 0;
  const pctCrypto = totalAll > 0 ? (totalCryptoVal / totalAll) * 100 : 0;
  const pctStocks = totalAll > 0 ? (totalStocksVal / totalAll) * 100 : 0;

  const allHoldings = [...crypto.map((h) => ({ ...h, section: "crypto" })), ...stocks.map((h) => ({ ...h, section: "stocks" }))];
  const filteredHoldings = filter === "all" ? allHoldings : allHoldings.filter((h) => h.section === filter);

  const allocationData = [
    { name: "Cripto", value: totalCryptoVal, color: COLORS.amber },
    { name: "Acciones", value: totalStocksVal, color: COLORS.violet },
  ].filter((d) => d.value > 0);

  const sortedByValue = [...allHoldings].sort((a, b) => valueOf(b) - valueOf(a));
  const top4 = sortedByValue.slice(0, 4);
  const restVal = sortedByValue.slice(4).reduce((s, h) => s + valueOf(h), 0);
  const concentracionData = [
    ...top4.map((h, i) => ({ name: h.symbol, value: valueOf(h), color: CONCENTRATION_COLORS[i % CONCENTRATION_COLORS.length] })),
    ...(restVal > 0 ? [{ name: "Otros", value: restVal, color: "#B9B4C7" }] : []),
  ];

  return (
    <div className="appOuter">
      <Background />

      <main className="main">
          <Hero
            totalAll={totalAll}
            investedAll={investedAll}
            gainPctAll={gainPctAll}
            lastUpdated={lastUpdated}
            pctCrypto={pctCrypto}
            pctStocks={pctStocks}
            updating={updating}
            updateMsg={updateMsg}
            onRefresh={refreshPrices}
          />

          <div className="widgetsRow">
            <PortfolioWidget
              title="Cripto"
              broker="Binance"
              icon={Bitcoin}
              accent={COLORS.amber}
              list={crypto}
              sparkData={sparkFor(snapshots, "totalCrypto")}
              onAdd={() => openAddForm("crypto")}
              onEdit={(h) => openEditForm("crypto", h)}
              onDelete={(id) => deleteHolding("crypto", id)}
            />
            <PortfolioWidget
              title="Acciones"
              broker="Prex"
              icon={Landmark}
              accent={COLORS.violet}
              list={stocks}
              sparkData={sparkFor(snapshots, "totalStocks")}
              onAdd={() => openAddForm("stocks")}
              onEdit={(h) => openEditForm("stocks", h)}
              onDelete={(id) => deleteHolding("stocks", id)}
            />
          </div>

          <div className="donutsRow">
            <DonutMini title="Distribución" data={allocationData} />
            <DonutMini title="Concentración" data={concentracionData} />
          </div>

          <EvolutionChart snapshots={snapshots} />

          <HoldingsTable
            filter={filter}
            setFilter={setFilter}
            filteredHoldings={filteredHoldings}
            formOpen={formOpen}
            formSection={formSection}
            setFormSection={setFormSection}
            editingId={editingId}
            form={form}
            setForm={setForm}
            formError={formError}
            onOpenAdd={() => openAddForm()}
            onEdit={openEditForm}
            onDelete={deleteHolding}
            onSubmit={submitForm}
            onCancel={closeForm}
          />
      </main>
    </div>
  );
}
