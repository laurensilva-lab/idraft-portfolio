# Mi Cartera

Dashboard de una sola pantalla para ver en un solo lugar tus acciones (Prex) y tus criptomonedas (Binance). Solo visualización — no hay ningún botón de compra/venta.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí la URL que te muestra la terminal (normalmente http://localhost:5173).

Para generar una build de producción:

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  App.jsx                  # orquesta el estado y arma la pantalla
  theme.js                 # paleta de colores (glassmorphism)
  main.jsx                 # entrada de React
  styles.css                # estilos globales (mantiene los mismos valores que theme.js)
  components/
    Background.jsx         # blobs difuminados animados de fondo
    Sidebar.jsx             # barra lateral con accesos rápidos
    Hero.jsx                 # tarjeta de patrimonio total
    PortfolioWidget.jsx      # tarjeta reutilizable (se usa para Cripto y Acciones)
    DonutMini.jsx            # gráfico de torta reutilizable (Distribución y Concentración)
    EvolutionChart.jsx       # gráfico de área con la evolución del patrimonio
    HoldingsTable.jsx        # tabla de posiciones con filtro
    HoldingForm.jsx          # formulario de alta/edición de una posición
  utils/
    format.js                # helpers de formato (moneda, porcentaje, fechas)
    storage.js                # persistencia en localStorage
    priceApi.js                # búsqueda de precios en vivo (CoinGecko / Yahoo Finance)
```

## Actualización de precios

- **Cripto**: busca el precio actual en la API pública de CoinGecko (no necesita API key).
- **Acciones**: intenta buscar el precio en el endpoint público de Yahoo Finance. Este endpoint no siempre permite pedidos directos desde el navegador (política CORS del lado de Yahoo); si falla, el símbolo simplemente no se actualiza y podés cargar el precio a mano.
- Cada vez que tocás "Actualizar precios" se guarda automáticamente un snapshot del total de ese día, que alimenta el gráfico de evolución.

## Datos

Todo se guarda en `localStorage` del navegador — no se manda a ningún servidor. Si limpiás los datos del sitio en el navegador, se pierde el historial.
