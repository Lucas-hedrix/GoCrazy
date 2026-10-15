import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-11 w-11 shrink-0 drop-shadow-[0_6px_18px_rgba(225,29,47,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
      >
        <defs>
          <linearGradient id="gcd-badge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-brand-strong, #ff3247)" />
            <stop offset="0.55" stopColor="var(--color-brand, #e11d2f)" />
            <stop offset="1" stopColor="var(--color-brand-deep, #6d0d16)" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#gcd-badge)" />
        <text
          x="32"
          y="45"
          textAnchor="middle"
          fontFamily="Anton, 'Arial Black', sans-serif"
          fontSize="32"
          fill="#ffffff"
          transform="rotate(-8 32 32)"
        >
          G!
        </text>
        <path
          d="M49 8 L51.2 12.8 L56 15 L51.2 17.2 L49 22 L46.8 17.2 L42 15 L46.8 12.8 Z"
          fill="var(--color-cream, #f5f4f0)"
          opacity="0.9"
        />
      </svg>
      <span className="font-display text-[22px] leading-[0.95] tracking-wide">
        GO CRAZY
        <br />
        <span className="text-brand">DEALS</span>
      </span>
    </Link>
  );
}
