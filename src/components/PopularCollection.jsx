import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "../lib/products";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import CategoryChips from "./CategoryChips";

export default function PopularCollection() {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let active = true;
    getProducts({ featured: true }).then((p) => {
      if (active) setProducts(p);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      !products ? [] : category === "all" ? products : products.filter((p) => p.category === category),
    [products, category]
  );

  return (
    <section id="popular" className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-3xl tracking-wide">POPULAR COLLECTION</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CategoryChips value={category} onChange={setCategory} />
          <Link
            to="/collection"
            className="group flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-cream"
          >
            See All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
        {products === null
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
