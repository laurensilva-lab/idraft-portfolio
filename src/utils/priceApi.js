// Best-effort live price lookups. Both are free/public endpoints and need no API key,
// but Yahoo Finance in particular may block direct browser requests depending on CORS
// policy at the time - it's wrapped in try/catch by the caller.

export const CRYPTO_ID_MAP = {
  BTC: "bitcoin", ETH: "ethereum", SOL: "solana", XRP: "ripple", ADA: "cardano",
  DOGE: "dogecoin", BNB: "binancecoin", USDT: "tether", USDC: "usd-coin",
  MATIC: "matic-network", POL: "polygon-ecosystem-token", DOT: "polkadot",
  LTC: "litecoin", AVAX: "avalanche-2", LINK: "chainlink", TRX: "tron",
  SHIB: "shiba-inu", ATOM: "cosmos", XLM: "stellar", ETC: "ethereum-classic",
  BCH: "bitcoin-cash", NEAR: "near", APT: "aptos", ARB: "arbitrum",
  OP: "optimism", UNI: "uniswap", FIL: "filecoin", ICP: "internet-computer",
  HBAR: "hedera-hashgraph", VET: "vechain", ALGO: "algorand", SAND: "the-sandbox",
  MANA: "decentraland", AAVE: "aave", MKR: "maker", GRT: "the-graph",
  XTZ: "tezos", THETA: "theta-token", EOS: "eos", XMR: "monero",
};

export async function fetchCryptoPrice(symbol) {
  const key = symbol.toUpperCase();
  let id = CRYPTO_ID_MAP[key];
  if (!id) {
    const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(key)}`);
    if (!searchRes.ok) throw new Error("search failed");
    const searchData = await searchRes.json();
    const coins = searchData.coins || [];
    const match = coins.find((c) => c.symbol && c.symbol.toUpperCase() === key) || coins[0];
    if (!match) throw new Error("not found");
    id = match.id;
  }
  const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
  if (!priceRes.ok) throw new Error("price failed");
  const priceData = await priceRes.json();
  const price = priceData[id] && priceData[id].usd;
  if (!Number.isFinite(price)) throw new Error("no price");
  return price;
}

export async function fetchStockPrice(symbol) {
  const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol.toUpperCase())}`);
  if (!res.ok) throw new Error("stock fetch failed");
  const data = await res.json();
  const result = data && data.chart && data.chart.result && data.chart.result[0];
  const price = result && result.meta && result.meta.regularMarketPrice;
  if (!Number.isFinite(price)) throw new Error("no price");
  return price;
}
