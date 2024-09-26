import Link from "next/link";
import InfoButton from "./info-button";
import LangButton from "./lang-button";
import SearchForm from "./search-form";

export default function Header() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">
          HNG 単字検索<span className="text-sm badge badge-primary">v2</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <SearchForm />
        <InfoButton />
        <LangButton />
      </div>
    </div>
  );
}
