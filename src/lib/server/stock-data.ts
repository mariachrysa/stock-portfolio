import "server-only";
import { connection } from "next/server";
import { sampleSearchResults, type Quote } from "../sample-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let flakyQuoteShouldFail = true;

async function requireKey() {
  await connection(); // Load at request time, including when reused in D8.
  if (!process.env.STOCK_API_KEY?.trim()) throw new Error("Missing practice key.");
}

export async function searchStocks(term: string) {
  await requireKey();
  term = term.trim().toLowerCase();
  await delay(term === "apple" ? 1500 : 200);
  if (term === "error") throw new Error("Demonstration search failure.");
  const symbol = term === "apple" ? "AAPL" : term.toUpperCase();
  return sampleSearchResults.filter((stock) => stock.symbol === symbol);
}

// D8 calls this directly from the server page, no HTTP request to its own API.
export async function loadQuote(symbol: string): Promise<Quote | null> {
  await requireKey();
  symbol = symbol.trim().toUpperCase();
  await delay(500);
  if (symbol === "ERROR") throw new Error("Demonstration quote failure.");
  if (symbol === "FLAKY" && flakyQuoteShouldFail) {
    flakyQuoteShouldFail = false;
    throw new Error("Demonstration quote failure that succeeds on retry.");
  }
  const prices = new Map([["IBM", "160.00"], ["MSFT", "320.00"], ["AAPL", "200.00"], ["QQQ", "450.00"], ["FLAKY", "123.45"]]);
  const price = prices.get(symbol);
  return price ? { symbol, price, currency: "USD", asOf: "2026-09-18" } : null;
}
