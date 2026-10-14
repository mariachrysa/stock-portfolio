"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import type {Holding, Stock,} from "@/lib/sample-data";


const holdingSchema = z.object({
  symbol: z.string().trim().min(1),
  name: z.string().trim().min(1),
  currency: z.literal("USD"),
  quantity: z.number().int().min(1).max(10000),
  averagePriceCents: z.number().int().positive().safe(),
});

const holdingsSchema = z.array(holdingSchema).refine(
  (holdings) => {
    const symbols = holdings.map((holding) =>
      holding.symbol.trim().toUpperCase()
    );

    return new Set(symbols).size === symbols.length;
  },
  { message: "Duplicate stock symbols are not allowed." }
);

const STORAGE_KEY = "portfolio-holdings";

export function useHoldings() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isRestored, setIsRestored] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        setHoldings([]);
        setIsRestored(true);
        return;
      }

      const parsed = JSON.parse(raw);
      const result = holdingsSchema.safeParse(parsed);
      
      if (!result.success) {
        setStorageError("Saved portfolio was invalid and has been reset.");
        setHoldings([]);
        setIsRestored(true);
        return;
      }

      setHoldings(result.data);
    } catch {
      setStorageError("Saved portfolio was invalid and has been reset.");
      setHoldings([]);
    }
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (!isRestored) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings, isRestored]);

  function addHolding(stock: Stock, quantity: number, averagePriceCents: number): string | null {
    const normalizedSymbol = stock.symbol.trim().toUpperCase();

    if (stock.currency.trim().toUpperCase() !== "USD") {
      return "Only USD stocks can be added.";
    }

    const alreadyExists = holdings.some((holding) => holding.symbol.trim().toUpperCase() === normalizedSymbol);

    if (alreadyExists) {
      return `${normalizedSymbol} is already in your portfolio. Edit the existing holding instead.`;
    }

    setHoldings((current) => [
      ...current,
      {
        symbol: normalizedSymbol,
        name: stock.name,
        currency: "USD",
        quantity,
        averagePriceCents,
      },
    ]);

    return null;
  }

  function saveHolding(symbol: string, quantity: number, averagePriceCents: number) {
    const normalizedSymbol = symbol.trim().toUpperCase();

    setHoldings((current) => current.map((holding) => {
      const sameHolding = holding.symbol.trim().toUpperCase() === normalizedSymbol;

      if (!sameHolding) {
        return holding;
      }
      return {...holding, quantity, averagePriceCents};
    })
  );}

  function removeHolding(symbol: string) {
    const normalizedSymbol = symbol.trim().toUpperCase();
    setHoldings((current) => current.filter((holding) => holding.symbol.trim().toUpperCase() !== normalizedSymbol));
  }

  return {holdings, addHolding, saveHolding, removeHolding, isRestored, storageError};}