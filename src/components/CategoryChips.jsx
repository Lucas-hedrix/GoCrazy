import { motion } from "motion/react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "shirt", label: "Shirts" },
  { id: "pant", label: "Pants" },
];

export default function CategoryChips({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {CATEGORIES.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              active ? "text-white" : "text-muted hover:text-cream"
            }`}
          >
            {active && (
              <motion.span
                layoutId="cat-chip"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/25"
              />
            )}
            <span className="relative">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
