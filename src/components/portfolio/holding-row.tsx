import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import type { Holding } from "@/lib/sample-data";
import { validateHoldingForm } from "./holding-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HoldingRowProps = {
  holding: Holding;
  isEditing: boolean;
  onEdit: (symbol: string) => void;
  onCancel: () => void;
  onSave: (
    symbol: string,
    quantity: number,
    averagePriceCents: number
  ) => void;
  onRemove: (symbol: string) => void;
};

function HoldingRow({
  holding,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onRemove,
}: HoldingRowProps) {
  const [quantity, setQuantity] = useState(String(holding.quantity));

  const [price, setPrice] = useState(
    (holding.averagePriceCents / 100).toFixed(2)
  );

  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");

  const quantityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      quantityInputRef.current?.focus();
    }
  }, [isEditing]);

  const averagePrice = (
    holding.averagePriceCents / 100
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const costCents = holding.quantity * holding.averagePriceCents;

  const cost = (costCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  function startEdit() {
    setQuantity(String(holding.quantity));
    setPrice((holding.averagePriceCents / 100).toFixed(2));

    setQuantityError("");
    setPriceError("");

    onEdit(holding.symbol);
  }

  function cancelEdit() {
    setQuantity(String(holding.quantity));
    setPrice((holding.averagePriceCents / 100).toFixed(2));

    setQuantityError("");
    setPriceError("");

    onCancel();
  }

  function saveEdit() {
    const result = validateHoldingForm(quantity, price);

    if (!result.success) {
      setQuantityError(result.errors.quantity ?? "");
      setPriceError(result.errors.price ?? "");
      return;
    }

    setQuantityError("");
    setPriceError("");

    onSave(
      holding.symbol,
      result.data.quantity,
      result.data.averagePriceCents
    );
  }

  if (isEditing) {
  return (
    <tr>
      <td colSpan={6} className="p-4">
        <div className="rounded-xl border bg-muted/20 p-6">
          <div className="mb-4">
            <div className="font-semibold">
              {holding.symbol}
            </div>

            <div className="text-sm text-muted-foreground">
              {holding.name}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor={`edit-quantity-${holding.symbol}`}
                className="mb-2 block text-sm font-medium"
              >
                Quantity
              </label>

              <Input
                ref={quantityInputRef}
                id={`edit-quantity-${holding.symbol}`}
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                aria-invalid={quantityError ? true : undefined}             
                aria-describedby={quantityError ? `edit-quantity-error-${holding.symbol}` : undefined}
              />

              {quantityError && (
                <div 
                  id={`edit-quantity-error-${holding.symbol}`} 
                  role="alert"
                  className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {quantityError}
               </div>
)}

            </div>

            <div>
              <label
                htmlFor={`edit-price-${holding.symbol}`}
                className="mb-2 block text-sm font-medium"
              >
                Average Purchase Price
              </label>

              <Input
                id={`edit-price-${holding.symbol}`}
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                aria-invalid={ priceError ? true : undefined}
                aria-describedby={priceError ? `edit-price-error-${holding.symbol}` : undefined}
              />

              {priceError && (
                <div id={`edit-price-error-${holding.symbol}`}
                     role="alert"
                     className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                     {priceError}
                </div>
)}

            </div>
          </div>

          <div className="mt-4 rounded-md bg-background p-3 text-sm text-muted-foreground">
            Current Cost: {cost}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="w-32"
              type="button"
              onClick={saveEdit}
            >
              Save
            </Button>

            <Button
              className="w-32"
              type="button"
              variant="outline"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      </td>
    </tr>
  );
}

  return (
    <tr className="border-t">
      <td className="px-4 py-4"><Link href={`/stocks/${holding.symbol}`}>{holding.symbol}</Link></td>
      <td className="px-4 py-4">{holding.name}</td>
      <td className="px-4 py-4">{holding.quantity}</td>
      <td className="px-4 py-4">{averagePrice}</td>
      <td className="px-4 py-4">{cost}</td>

      <td className="px-4 py-4">
        <div className="flex flex-col gap-2">
        <Button className="w-32" size="sm" type="button" onClick={startEdit}>Edit</Button>
        <Button className="w-32" size="sm" type="button" variant="destructive" onClick={() => onRemove(holding.symbol)}>
          Remove
        </Button>
        </div>
      </td>
    </tr>
  );
}

export default HoldingRow;