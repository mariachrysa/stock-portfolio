import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchAreaProps = {
  searchText: string;
  searchError: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
};

function SearchArea({
  searchText,
  searchError,
  onSearchTextChange,
  onSearch,
}: SearchAreaProps) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Search Stocks</h2>

      <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-center">
        <label htmlFor="stock-search" className="text-sm font-medium">
          Symbol or company name
        </label>

        <Input
          id="stock-search"
          type="text"
          value={searchText}
          onChange={(event) =>
            onSearchTextChange(event.target.value)
          }
          placeholder="Symbol or company name"
          aria-invalid={searchError ? true : undefined}
          aria-describedby={
            searchError
              ? "stock-search-error"
              : undefined
          }
        />

        <Button className="w-32" type="button" onClick={onSearch}>Search</Button>

        {searchError && (
          <p id="stock-search-error"
             role="alert"
             className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {searchError}
          </p>
        )}
      </div>
    </section>
  );
}

export default SearchArea;