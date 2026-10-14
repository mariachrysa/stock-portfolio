export type Stock = { symbol: string; name: string; currency: string };
export type Holding = Stock & {
  currency: "USD";
  quantity: number;
  averagePriceCents: number;
};
export type Quote = { symbol: string; price: string; currency: "USD"; asOf: string };

// D1/D2 samples only. Do not use these as a localStorage fallback in D5.
export const sampleHoldings: Holding[] = [
  { symbol: "IBM", name: "IBM", currency: "USD", quantity: 10, averagePriceCents: 15050 },
  { symbol: "MSFT", name: "Microsoft Corporation", currency: "USD", quantity: 5, averagePriceCents: 30000 },
];

export const sampleSearchResults: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", currency: "USD" },
  { symbol: "IBM", name: "IBM", currency: "USD" },
  { symbol: "MSFT", name: "Microsoft Corporation", currency: "USD" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", currency: "USD" },
  { symbol: "EUR-DEMO", name: "Fictional Euro Company", currency: "EUR" },
];
