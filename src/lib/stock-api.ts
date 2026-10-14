import type { Quote, Stock } from "./sample-data";

// D3: call from an Effect. D4/D7: reuse as the query function.
export async function fetchSearchResults(term: string, signal?: AbortSignal): Promise<Stock[]> {
  const params = new URLSearchParams({ keywords: term });
  const response = await fetch(`/api/stocks/search?${params}`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Search failed. Check the local setup or try again.");
  const data = await response.json();
  return data.results;
}

export async function fetchQuote(symbol: string, signal?: AbortSignal): Promise<Quote | null> {
  const params = new URLSearchParams({ symbol });
  const response = await fetch(`/api/stocks/quote?${params}`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Quote failed. Check the local setup or try again.");
  const data = await response.json();
  return data.quote;
}
