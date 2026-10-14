import type { Holding } from "@/lib/sample-data";
import HoldingRow from "./holding-row";

type HoldingsTableProps = {
  holdings: Holding[];
  editingSymbol: string | null;
  onEdit: (symbol: string) => void;
  onCancel: () => void;
  onSave: (
    symbol: string,
    quantity: number,
    averagePriceCents: number
  ) => void;
  onRemove: (symbol: string) => void;
};

function HoldingsTable({
  holdings,
  editingSymbol,
  onEdit,
  onCancel,
  onSave,
  onRemove,
}: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <section>
        <h2>Holdings</h2>
        <p>No holdings in portfolio.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-8 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Holdings</h2>

      <table className="w-full table-fixed">
        <thead className="border-b">
          <tr>
            <th className="w-[14%] px-4 py-3 text-left">Symbol</th>
            <th className="w-[28%] px-4 py-3 text-left">Name</th>
            <th className="w-[12%] px-4 py-3 text-left">Quantity</th>
            <th className="w-[18%] px-4 py-3 text-left">Average Price</th>
            <th className="w-[18%] px-4 py-3 text-left">Cost</th>
            <th className="w-[180px] px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {holdings.map((holding) => (
            <HoldingRow
              key={holding.symbol}
              holding={holding}
              isEditing={
                editingSymbol?.toUpperCase() ===
                holding.symbol.trim().toUpperCase()
              }
              onEdit={onEdit}
              onCancel={onCancel}
              onSave={onSave}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default HoldingsTable;