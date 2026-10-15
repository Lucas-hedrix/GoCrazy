import { useEffect, useMemo, useState } from "react";
import { SearchX, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../lib/products";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import CategoryChips from "../components/CategoryChips";

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(paramQ);
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState(null);

  useEffect(() => {
    setQ(paramQ);
  }, [paramQ]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams(q ? { q } : {}, { replace: true });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    let active = true;
    setProducts(null);
    getProducts({ search: paramQ }).then((p) => {
      if (active) setProducts(p);
    });
    return () => {
      active = false;
    };
  }, [paramQ]);

  const filtered = useMemo(
    () =>
      !products ? [] : category === "all" ? products : products.filter((p) => p.category === category),
    [products, category]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-wide">FULL COLLECTION</h1>
          <p className="mt-1 text-sm text-muted">
            {products
              ? `${filtered.length} piece${filtered.length === 1 ? "" : "s"}`
              : "Loading pieces..."}
          </p>
        </div>
        <form className="flex w-full max-w-xs items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-2.5 transition-colors focus-within:border-brand/50">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search shirts, pants, brands..."
            className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-muted"
          />
        </form>
      </div>

      <div className="mt-6">
        <CategoryChips value={category} onChange={setCategory} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products === null
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>

      {products !== null && filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-card-2 text-muted">
            <SearchX className="h-7 w-7" />
          </div>
          <h3 className="font-bold">No pieces found</h3>
          <p className="text-sm text-muted">
            {paramQ ? `Nothing matches "${paramQ}" yet. Try another search.` : "Check back soon — new drops weekly."}
          </p>
        </div>
      )}
    </div>
  );
}
