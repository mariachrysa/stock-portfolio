import Link from "next/link";

import RefreshButton from "@/components/refresh-button";
import { Button } from "@/components/ui/button";
import { loadQuote } from "@/lib/server/stock-data";

type StockPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

const SYMBOL_PATTERN =
  /^[A-Z][A-Z0-9.-]{0,14}$/;

export default async function StockPage({
  params,
}: StockPageProps) {
  const { symbol } = await params;

  const normalizedSymbol =
    symbol.trim().toUpperCase();

  if (
    !SYMBOL_PATTERN.test(
      normalizedSymbol
    )
  ) {
    return (
      <main className="mx-auto max-w-2xl">
        <h1>Stock Details</h1>

        <p>Enter a valid stock symbol.
        </p>

        <Button asChild variant="outline">
        <Link href="/portfolio">Back to Portfolio</Link>
        </Button>

      </main>
    );
  }

  const quote = await loadQuote(
    normalizedSymbol
  );

  return (
    <main>
      <div className="rounded-xl border bg-background p-8 shadow-sm">
      <h1 className="text-4xl font-bold">{normalizedSymbol}</h1></div>

      {quote === null && (
        <p className="mt-6">
          Quote unavailable.
        </p>
      )}

      {quote !== null && (
        <div className="mt-6 space-y-3">
          <p className="text-lg">
            Symbol: {quote.symbol}
          </p>

          <p className="text-lg">
            Price: ${quote.price}
          </p>

          <p className="text-lg">
            Currency: {quote.currency}
          </p>

          <p className="text-lg">
            Quote Date: {quote.asOf}
          </p>
        </div>
      )}

      <div className="my-6"><RefreshButton /></div>

      <Button asChild variant="outline">
      <Link href="/portfolio">Back to Portfolio</Link>
      </Button>
    </main>
  );
}