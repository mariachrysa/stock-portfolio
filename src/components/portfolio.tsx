"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HoldingsTable from "@/components/portfolio/holdings-table";
import PortfolioSummary from "@/components/portfolio/portfolio-summary";
import SearchArea from "@/components/portfolio/search-area";
import SearchResults from "@/components/portfolio/search-results";

import { fetchSearchResults } from "@/lib/stock-api";
import { useHoldings } from "@/hooks/use-holdings";

export function Portfolio() {
  const {
    holdings,
    addHolding,
    saveHolding,
    removeHolding,
    isRestored,
    storageError,
  } = useHoldings();

  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [filterText, setFilterText] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  function search() {
    const term = searchText.trim();

    if (term.length < 1 || term.length > 50) {
      setSearchError("Enter between 1 and 50 characters.");
      return;
    }

    setSearchError("");
    setSubmittedTerm(term);
  }
  
  function updateSearchText(value: string) {
    setSearchText(value);
    setSearchError("");
  }

  const {data: searchResults = [], isPending, error} = useQuery({
    queryKey: ["stocks", submittedTerm],
    queryFn: ({ signal }) => fetchSearchResults(submittedTerm, signal),
    enabled: submittedTerm.length > 0,
    retry: false,
  });

  
const normalizedFilter = filterText.trim().toLowerCase();

const displayedHoldings = holdings
  .filter((holding) =>
    holding.symbol.toLowerCase().includes(normalizedFilter) ||
    holding.name.toLowerCase().includes(normalizedFilter)
  )
  .sort((a, b) =>
    sortAscending
      ? a.symbol.localeCompare(b.symbol)
      : b.symbol.localeCompare(a.symbol)
  );

  function clearFilters() {
    setFilterText("");
    setSortAscending(true);
  }
  let sortText = "Descending";

  if (sortAscending) {
    sortText = "Ascending";
  }

  if (!isRestored) {
    return <p>Loading...</p>;
  }

  return (
  <main className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        Portfolio
      </h1>

      <p className="mt-2 text-muted-foreground">
        Search stocks and manage your holdings.
      </p>
    </div>

    {storageError && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">
          {storageError}
        </p>
      </div>
    )}
    
  <SearchArea
    searchText={searchText}
    searchError={searchError}
    onSearchTextChange={updateSearchText}
    onSearch={search}
  />

  {!searchError && !submittedTerm && (
    <p className="text-muted-foreground">
      Search for a stock.
    </p>
  )}

  {!searchError && submittedTerm && isPending && (
    <p>Loading search results...</p>
  )}

  {!searchError && submittedTerm && error && (
    <p role="alert" className="text-red-700">
      Search failed. Please try again.
    </p>
  )}

  {!searchError &&
    submittedTerm &&
    !isPending &&
    !error &&
    searchResults.length === 0 && (
      <p>No results found.</p>
    )}

  {!searchError &&
    submittedTerm &&
    !isPending &&
    !error &&
    searchResults.length > 0 && (
      <SearchResults
        results={searchResults}
        onAdd={addHolding}
      />  
    )}

    <PortfolioSummary holdings={holdings} />

    <section className="rounded-xl border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Filters
      </h2>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div>
          <label 
            htmlFor="holdings-filter"
            className="mb-2 block text-sm font-medium"
          >
          Filter by symbol or name
          </label>
          <input 
            id="holdings-filter"
            className="h-10 w-full rounded-md border px-3 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            type="text"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            placeholder="e.g. IBM"
          />
        </div>


        <button className="h-10 min-w-36 rounded-md border px-4 transition-colors hover:bg-accent"
                type="button"
                onClick={() => setSortAscending(!sortAscending)}
        > Sort: {sortText}</button>

        <button
          className="h-10 min-w-36 rounded-md border px-4 transition-colors hover:bg-accent"
          type="button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </section>

    {holdings.length === 0 ? (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        No holdings in portfolio.
      </div>
    ) : displayedHoldings.length === 0 ? (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        No holdings match the current filter.
      </div>
    ) : (
      <HoldingsTable
        holdings={displayedHoldings}
        editingSymbol={editingSymbol}
        onEdit={setEditingSymbol}
        onCancel={() => setEditingSymbol(null)}
        onSave={(...args) => {saveHolding(...args); setEditingSymbol(null);}}
        onRemove={removeHolding}
      />
    )}
  </main>
);
}