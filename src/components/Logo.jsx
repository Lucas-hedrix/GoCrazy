import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <img
        src="/logo.JPG"
        alt="Go Crazy Deals"
        className="h-11 w-11 shrink-0 rounded-2xl object-cover shadow-lg shadow-brand/30 transition-transform group-hover:scale-105"
      />
      <span className="font-display text-[22px] leading-[0.95] tracking-wide">
        GO CRAZY
        <br />
        <span className="text-brand">DEALS</span>
      </span>
    </Link>
  );
}
