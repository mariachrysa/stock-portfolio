import type {Holding} from "@/lib/sample-data";
type PortfolioSummaryProps = {holdings: Holding[];};

function PortfolioSummary({holdings}: PortfolioSummaryProps){
    const numOfHoldings = holdings.length;
    const totalShares = holdings.reduce((total, holding) => total + holding.quantity, 0);
    const totalCostCents = holdings.reduce((total, holding) => total + holding.quantity * holding.averagePriceCents, 0);
    const formattedTotalCost = (totalCostCents / 100).toLocaleString("en-US", {style: "currency", currency: "USD",});

    return (
  <section>
    <h2 className="mb-4 text-lg font-semibold">
      Portfolio Summary
    </h2>

    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
        <p className="text-sm text-muted-foreground">
          Holdings
        </p>

        <p className="mt-2 text-4xl font-bold tracking-tight">
          {numOfHoldings}
        </p>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
        <p className="text-sm text-muted-foreground">
          Total Shares
        </p>

        <p className="mt-2 text-4xl font-bold tracking-tight">
          {totalShares}
        </p>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
        <p className="text-sm text-muted-foreground">
          Total Cost
        </p>

        <p className="mt-2 text-4xl font-bold tracking-tight">
          {formattedTotalCost}
        </p>
      </div>
    </div>
  </section>
);
}

export default PortfolioSummary;