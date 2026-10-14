import { searchStocks } from "@/lib/server/stock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("keywords")?.trim() ?? "";
  if (!term || term.length > 50) {
    return Response.json({ error: "Enter 1–50 characters." }, { status: 400 });
  }
  try {
    return Response.json({ results: await searchStocks(term) });
  } catch {
    return Response.json({ error: "Search unavailable. Check STOCK_API_KEY or try another term." }, { status: 503 });
  }
}
