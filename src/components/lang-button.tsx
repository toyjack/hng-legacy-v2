"use client";

import { MdLanguage } from "react-icons/md";

import { useChangeLocale } from "@/locales/client";

export default function LangButton() {
  const changeLocale = useChangeLocale();

  const langs = [
    {label: "日本語", value: "ja"},
    {label: "English", value: "en"},
    {label: "中文", value: "zh"},
  ];

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost md:text-3xl"
      >
        <MdLanguage />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        {langs.map((lang) => (
          <li key={lang.value}>
            <a onClick={() => changeLocale(lang.value as "ja" | "en" | "zh")}>
              {lang.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
