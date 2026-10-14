import { loadQuote } from "@/lib/server/stock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase() ?? "";
  if (!/^[A-Z][A-Z0-9.-]{0,14}$/.test(symbol)) {
    return Response.json({ error: "Enter a valid stock symbol." }, { status: 400 });
  }
  try {
    return Response.json({ quote: await loadQuote(symbol) });
  } catch {
    return Response.json({ error: "Quote unavailable. Check STOCK_API_KEY or try again." }, { status: 503 });
  }
}