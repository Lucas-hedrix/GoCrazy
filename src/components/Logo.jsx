import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

export default function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 transition-transform group-hover:scale-105">
        <Flame className="h-6 w-6" />
      </span>
      <span className="font-display text-[22px] leading-[0.95] tracking-wide">
        GO CRAZY
        <br />
        <span className="text-brand">DEALS</span>
      </span>
    </Link>
  );
}
