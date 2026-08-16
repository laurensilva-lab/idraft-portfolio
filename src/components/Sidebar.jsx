import { Wallet, Bitcoin, Landmark } from "lucide-react";

export default function Sidebar({ onAddCrypto, onAddStock }) {
  return (
    <aside className="sidebar glass">
      <div className="brandRow">
        <div className="brandMark">◆</div>
        <div className="brandName">MiCartera</div>
      </div>

      <div className="navItem">
        <Wallet size={15} /> Resumen
      </div>

      <div className="sidebarDivider" />
      <div className="sidebarSectionLabel">Acceso rápido</div>
      <button className="navGhost" onClick={onAddCrypto}>
        <Bitcoin size={15} /> Agregar cripto
      </button>
      <button className="navGhost" onClick={onAddStock}>
        <Landmark size={15} /> Agregar acción
      </button>

      <div className="sidebarSpacer" />
      <div className="sidebarNote">
        Cripto se actualiza vía CoinGecko y acciones vía Yahoo Finance al tocar "Actualizar precios". Si tu red bloquea la conexión,
        cargá los precios a mano.
      </div>
    </aside>
  );
}
