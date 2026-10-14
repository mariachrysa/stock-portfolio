import { z } from "zod";
export const quantitySchema = z
  .number()
  .int("Quantity must be a whole number.")
  .min(1, "Quantity must be at least 1.")
  .max(10000, "Quantity cannot be more than 10,000.");

type HoldingFormValues = {quantity: number; averagePriceCents: number;};
type HoldingFormErrors = {quantity?: string; price?: string;};
type HoldingFormValidationResult =
  | {success: true; data: HoldingFormValues;}
  | {success: false; errors: HoldingFormErrors;};

export function priceToCents(price: string): number | null {
  const trimmedPrice = price.trim();

  // Accept: 20, 20.5, 20.50
  // Reject: 1,50 20.123, letters
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(trimmedPrice)) {
    return null;
  }

  const [dollarsPart, centsPart = ""] = trimmedPrice.split(".");
  const dollars = dollarsPart === "" ? 0 : Number(dollarsPart);
  const cents = Number(centsPart.padEnd(2, "0"));
  const totalCents = dollars * 100 + cents;

  if (!Number.isSafeInteger(totalCents)) {
    return null;
  }

  return totalCents;
}

export function validateQuantity(quantity: string): string | null {
  const trimmedQuantity = quantity.trim();

  if (!/^\d+$/.test(trimmedQuantity)) {
    return "Quantity must be a whole number.";
  }

  const numericQuantity = Number(trimmedQuantity);
  if (!Number.isSafeInteger(numericQuantity)) {
    return "Quantity must be a whole number.";
  }

  const result = quantitySchema.safeParse(numericQuantity);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Invalid quantity.";
  }

  return null;
}

const priceSchema = z
  .string()
  .refine(
    (price) => priceToCents(price) !== null,
    "Price must use a dot and have at most two decimal places."
  )
  .refine(
    (price) => {
      const cents = priceToCents(price);
      return cents === null || cents > 0;
    },
    "Price must be above zero."
  );

export function validatePrice(price: string): string | null {
  const result = priceSchema.safeParse(price);

  if (!result.success) {
    return result.error.issues[0].message;
  }

  return null;
}

export function validateHoldingForm(quantity: string, price: string): HoldingFormValidationResult {
  const quantityError = validateQuantity(quantity);
  const priceError = validatePrice(price);

  if (quantityError || priceError) {
    return {
      success: false,
      errors: {
        quantity: quantityError ?? undefined,
        price: priceError ?? undefined,
      },
    };
  }

  const priceCents = priceToCents(price);
  if (priceCents === null) {
    return {
      success: false,
      errors: {
        price: "Price must use a dot and have at most two decimal places.",
      },
    };
  }

  return {
    success: true,
    data: {
      quantity: Number(quantity.trim()),
      averagePriceCents: priceCents,
    },
  };
}