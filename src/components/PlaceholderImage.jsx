import { Shirt } from "lucide-react";

function PantsIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 3h10v4l1.5 14h-5L12 12l-1.5 9h-5L7 7V3z" />
      <path d="M7 6h10" />
    </svg>
  );
}

export default function PlaceholderImage({ category }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-card-2 via-card to-ink">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-brand/25 bg-brand/10">
        {category === "pant" ? (
          <PantsIcon className="h-8 w-8 text-brand/80" />
        ) : (
          <Shirt className="h-8 w-8 text-brand/80" />
        )}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted/70">
        Image coming soon
      </span>
    </div>
  );
}
