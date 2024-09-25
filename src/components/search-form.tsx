"use client";

import { useCurrentLocale } from "@/locales/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const router = useRouter();
  const currentLocale = useCurrentLocale();
  const [character, setCharacter] = useState("");

  const search = () => {
    router.push(`/${currentLocale}/${encodeURIComponent(character)}`);
  };

  return (
    <div className="join">
      <input
        type="text"
        className="input input-bordered w-32 join-item"
        value={character}
        onChange={(e) => setCharacter(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            search();
          }
        }}
      />
      <button className="btn btn-primary join-item" onClick={() => search()}>
        検索
      </button>
    </div>
  );
}
