import { useState } from "react";
import { motion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { fmt } from "../lib/format";
import PlaceholderImage from "./PlaceholderImage";
import RatingStars from "./RatingStars";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const sizes = product.sizes ?? ["M"];
  const [size, setSize] = useState(sizes.includes("M") ? "M" : sizes[0]);
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = product.image && !imageFailed;

  const handleAdd = () => {
    addItem(product, size);
    push({
      title: "Added to cart",
      message: `${product.name} · Size ${size}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount =
    product.salePrice != null && product.price > 0
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: "easeOut" }}
      className="group rounded-3xl border border-line bg-card p-3 transition-colors hover:border-brand/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card-2">
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage category={product.category} />
        )}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-extrabold text-white">
            -{discount}%
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full border border-line bg-ink/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted backdrop-blur">
          {product.category === "pant" ? "Pants" : "Shirt"}
        </span>
      </div>

      <div className="px-2 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold">{product.name}</h3>
            {product.brand && <p className="truncate text-xs text-muted">{product.brand}</p>}
          </div>
          <RatingStars rating={product.rating} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-lg border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                size === s
                  ? "border-brand/60 bg-brand/15 text-brand"
                  : "border-line text-muted hover:text-cream"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="leading-none">
            {product.salePrice != null && (
              <div className="mb-1.5 text-xs text-muted line-through">{fmt(product.price)}</div>
            )}
            <div className="font-display text-3xl text-brand">
              {fmt(product.salePrice ?? product.price)}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-strong"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {added ? "Added" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
