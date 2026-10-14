import { useEffect, useRef, useState } from "react";

import type { Stock } from "@/lib/sample-data";
import Link from "next/link";
import { validateHoldingForm } from "./holding-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchResultsProps = {
  results: Stock[];
  onAdd: (stock: Stock, quantity: number, averagePriceCents: number) => string | null;
};

function SearchResults({ results, onAdd }: SearchResultsProps) {
  const [stockBeingAdded, setStockBeingAdded] = useState<string | null>(null);

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [addError, setAddError] = useState("");

  const quantityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stockBeingAdded !== null) {
      quantityInputRef.current?.focus();
    }
  }, [stockBeingAdded]);

  function openAddForm(symbol: string) {
    setStockBeingAdded(symbol);
    setQuantity("");
    setPrice("");
    setQuantityError("");
    setPriceError("");
    setAddError("");
  }

  function cancelAdd() {
    setStockBeingAdded(null);
    setQuantity("");
    setPrice("");
    setQuantityError("");
    setPriceError("");
    setAddError("");
  }
  
  function saveHolding(stock: Stock) {
    const result = validateHoldingForm(quantity, price);

    setAddError("");

    if (!result.success) {
      setQuantityError(result.errors.quantity ?? "");
      setPriceError(result.errors.price ?? "");
      return;
    }

    setQuantityError("");
    setPriceError("");

    const error = onAdd(
      stock,
      result.data.quantity,
      result.data.averagePriceCents
    );

    if (error) {
      setAddError(error);
      return;
    }

    cancelAdd();
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Results</h2>

      <table className="w-full table-fixed">
        <thead className="border-b">
          <tr className="border-b">
            <th className="px-4 py-3 text-left">Symbol</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Currency</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {results.map((stock) => {
            const isAdding = stockBeingAdded?.toUpperCase() === stock.symbol.toUpperCase();

            return (
              <tr key={stock.symbol}>
                <td className="w-[45%] px-4 py-4"><Link href={`/stocks/${stock.symbol}`}>{stock.symbol}</Link></td>
                <td className="w-[45%] px-4 py-4">{stock.name}</td>
                <td className="w-[45%] px-4 py-4">{stock.currency}</td>

                <td className="w-[45%] px-4 py-4">
                  {isAdding ? (
                    <div>
                      <div>
                        <label htmlFor={`add-quantity-${stock.symbol}`}>
                          Quantity
                        </label>

                        <Input
                          ref={quantityInputRef}
                          id={`add-quantity-${stock.symbol}`}
                          type="text"
                          inputMode="numeric"
                          value={quantity}
                          onChange={(event) =>
                            setQuantity(event.target.value)
                          }
                          aria-invalid={quantityError ? true : undefined}
                          aria-describedby={
                            quantityError
                              ? `add-quantity-error-${stock.symbol}`
                              : undefined
                          }
                        />

                        {quantityError && (
                          <p id={`add-quantity-error-${stock.symbol}`}role="alert">
                            {quantityError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`add-price-${stock.symbol}`}>
                          Average purchase price
                        </label>

                        <Input
                          id={`add-price-${stock.symbol}`}
                          type="text"
                          inputMode="decimal"
                          value={price}
                          onChange={(event) =>
                            setPrice(event.target.value)
                          }
                          aria-invalid={priceError ? true : undefined}
                          aria-describedby={
                            priceError
                              ? `add-price-error-${stock.symbol}`
                              : undefined
                          }
                        />

                        {priceError && (
                          <p id={`add-price-error-${stock.symbol}`} role="alert" >
                            {priceError}
                          </p>
                        )}
                      </div>

                      {addError && (<p role="alert" className="mt-2 text-sm text-red-700">{addError}</p>)}

                      <Button
                        type="button"
                        onClick={() => saveHolding(stock)}
                      >
                        Save
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelAdd}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => openAddForm(stock.symbol)}
                    >
                      Add
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default SearchResults;